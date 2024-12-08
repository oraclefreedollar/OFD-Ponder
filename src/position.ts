import { ponder } from "@/generated";
import {ActiveUser, Ecosystem, MintingUpdate, Position as PositionSchema} from '../ponder.schema'

ponder.on('Position:MintingUpdate', async ({ event, context }) => {
  const { client } = context;
  const database = context.db;
  const { Position, Savings } = context.contracts;

  // event MintingUpdate(uint256 collateral, uint256 price, uint256 minted);
  const { collateral, price, minted } = event.args;
  const positionAddress = event.log.address;

  // position updates
  const availableForClones = await client.readContract({
    abi: Position.abi,
    address: positionAddress,
    functionName: 'availableForClones',
  });

  const availableForMinting = await client.readContract({
    abi: Position.abi,
    address: positionAddress,
    functionName: 'availableForMinting',
  });

  const cooldown = await client.readContract({
    abi: Position.abi,
    address: positionAddress,
    functionName: 'cooldown',
  });

  const baseRatePPM = await client.readContract({
    abi: Savings.abi,
    address: Savings.address,
    functionName: 'currentRatePPM',
  });

  const position = await database.find(Position, {id: positionAddress.toLowerCase()});

  if (!position) throw new Error('Position unknown in MintingUpdate');

  await database.update(PositionSchema, {id: positionAddress.toLowerCase()}).set({
    collateralBalance: collateral,
    price,
    minted,
    availableForMinting,
    availableForClones,
    cooldown: BigInt(cooldown),
    closed: collateral == 0n,
  });

  // minting updates
  const idEco = `PositionMintingUpdates:${positionAddress.toLowerCase()}`;

  await database.insert(Ecosystem).values({
    id: idEco,
    value: '',
    amount: 0n,
  }).onConflictDoUpdate((current)=> ({
    amount: current.amount + 1n,
  }));

  const ecosystem = await database.find(Ecosystem, {id: idEco})
  const mintingCounter = ecosystem?.amount;

  if (mintingCounter === undefined) throw new Error('MintingCounter not found.');

  const idMinting = function (cnt: number | bigint) {
    return `${positionAddress.toLowerCase()}-${cnt}`;
  };

  const annualInterestPPM = baseRatePPM + position.riskPremiumPPM;

  const getFeeTimeframe = function (): number {
    const OneMonth = 60 * 60 * 24 * 30;
    const secToExp = Math.floor(parseInt(position.expiration.toString()) - parseInt(event.block.timestamp.toString()));
    return Math.max(OneMonth, secToExp);
  };

  const getFeePPM = function (): bigint {
    const OneYear = 60 * 60 * 24 * 365;
    const calc: number = (getFeeTimeframe() * (baseRatePPM + position.riskPremiumPPM)) / OneYear;
    return BigInt(Math.floor(calc));
  };

  const getFeePaid = function (amount: bigint): bigint {
    return (getFeePPM() * amount) / 1_000_000n;
  };

  if (mintingCounter === 1n) {
    await database.insert(MintingUpdate).values({
      id: idMinting(1),
      txHash: event.transaction.hash,
      created: event.block.timestamp,
      position: position.position,
      owner: position.owner,
      isClone: position.original.toLowerCase() != position.position.toLowerCase(),
      collateral: position.collateral,
      collateralName: position.collateralName,
      collateralSymbol: position.collateralSymbol,
      collateralDecimals: position.collateralDecimals,
      size: collateral,
      price: price,
      minted: minted,
      sizeAdjusted: collateral,
      priceAdjusted: price,
      mintedAdjusted: minted,
      annualInterestPPM: annualInterestPPM,
      basePremiumPPM: baseRatePPM,
      riskPremiumPPM: position.riskPremiumPPM,
      reserveContribution: position.reserveContribution,
      feeTimeframe: getFeeTimeframe(),
      feePPM: parseInt(getFeePPM().toString()),
      feePaid: getFeePaid(minted),
    });
  } else {
    const prev = await database.find(MintingUpdate, {id: idMinting(mintingCounter - 1n)});
    if (prev == null) throw new Error(`previous minting update not found.`);

    const sizeAdjusted = collateral - prev.size;
    const priceAdjusted = price - prev.price;
    const mintedAdjusted = minted - prev.minted;
    const basePremiumPPMAdjusted = baseRatePPM - prev.basePremiumPPM;

    await database.insert(MintingUpdate).values({
      id: idMinting(mintingCounter),
      txHash: event.transaction.hash,
      created: event.block.timestamp,
      position: position.position,
      owner: position.owner,
      isClone: position.original.toLowerCase() != position.position.toLowerCase(),
      collateral: position.collateral,
      collateralName: position.collateralName,
      collateralSymbol: position.collateralSymbol,
      collateralDecimals: position.collateralDecimals,
      size: collateral,
      price: price,
      minted: minted,
      sizeAdjusted,
      priceAdjusted,
      mintedAdjusted,
      annualInterestPPM,
      basePremiumPPM: baseRatePPM,
      riskPremiumPPM: position.riskPremiumPPM,
      reserveContribution: position.reserveContribution,
      feeTimeframe: getFeeTimeframe(),
      feePPM: parseInt(getFeePPM().toString()),
      feePaid: mintedAdjusted > 0n ? getFeePaid(mintedAdjusted) : 0n,
    })
  }

  // user updates
  await database.insert(ActiveUser).values({
      id: event.transaction.from,
      lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
      lastActiveTime: event.block.timestamp,
  }))

});

ponder.on('Position:PositionDenied', async ({ event, context }) => {
  const { client, contracts } = context;
  const database = context.db;
  const { Position } = contracts;

  const position =  await database.find(PositionSchema, {id: event.log.address.toLowerCase()});

  const cooldown = await client.readContract({
    abi: Position.abi,
    address: event.log.address,
    functionName: 'cooldown',
  });

  if (position) {
    await database.update(PositionSchema, {id: event.log.address.toLowerCase()}).set({
      cooldown: BigInt(cooldown),
      denied: true,
    });
  }

  await database.insert(ActiveUser).values({
    id: event.transaction.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
    lastActiveTime: event.block.timestamp,
  }))
});

ponder.on('Position:OwnershipTransferred', async ({ event, context }) => {
  const database = context.db;


  const position =  await database.find(PositionSchema, {id: event.log.address.toLowerCase()});

  if (position) {
    await database.update(PositionSchema, {id: event.log.address.toLowerCase()}).set({
      owner: event.args.newOwner,
    });
  }
  
  await database.insert(ActiveUser).values({
      id: event.transaction.from,
      lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
      lastActiveTime: event.block.timestamp,
  }))
});
