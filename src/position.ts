import { ponder } from "@/generated";
import {ActiveUser, Ecosystem, MintingUpdate, Position as PositionSchema} from '../ponder.schema'

ponder.on('Position:MintingUpdate', async ({ event, context }) => {
  try {


  const { client, db, network } = context;
  const database = db;
  const { chainId } = network;
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

  const position = await database.find(PositionSchema, {id: positionAddress.toLowerCase(), chainId});

  if (!position) {
    console.warn(`Position ${positionAddress.toLowerCase()} not found for MintingUpdate event in block ${event.block.number}. Creating new record.`);
    return;
  }

  await database.update(PositionSchema, {id: positionAddress.toLowerCase()}).set({
    chainId,
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
    chainId,
    id: idEco,
    value: '',
    amount: 1n,
  }).onConflictDoUpdate((current)=> ({
    amount: current.amount + 1n,
  }));

  const ecosystem = await database.find(Ecosystem, {id: idEco, chainId})
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
      chainId,
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
    const prev = await database.find(MintingUpdate, {id: idMinting(mintingCounter - 1n), chainId});
    if (prev == null) throw new Error(`previous minting update not found.`);

    const sizeAdjusted = collateral - prev.size;
    const priceAdjusted = price - prev.price;
    const mintedAdjusted = minted - prev.minted;
    const basePremiumPPMAdjusted = baseRatePPM - prev.basePremiumPPM;

    await database.insert(MintingUpdate).values({
      chainId,
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
      feePaid: mintedAdjusted > 0n ? getFeePaid(BigInt(mintedAdjusted)) : 0n,
    })
  }

  // user updates
  await database.insert(ActiveUser).values({
    chainId,
    id: event.transaction.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
      lastActiveTime: event.block.timestamp,
  }))
  } catch (error) {
    console.error(`Error processing MintingUpdate event: ${error.message}`);
  }
});

ponder.on('Position:PositionDenied', async ({ event, context }) => {
  const { client, contracts, db, network } = context;
  const database = db;
  const { chainId } = network;
  const { Position } = contracts;

  const position =  await database.find(PositionSchema, {id: event.log.address.toLowerCase(), chainId});

  const cooldown = await client.readContract({
    abi: Position.abi,
    address: event.log.address,
    functionName: 'cooldown',
  });

  if (position) {
    await database.update(PositionSchema, {id: event.log.address.toLowerCase()}).set({
      chainId,
      cooldown: BigInt(cooldown),
      denied: true,
    });
  }

  await database.insert(ActiveUser).values({
    chainId,
    id: event.transaction.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
    lastActiveTime: event.block.timestamp,
  }))
});

ponder.on('Position:OwnershipTransferred', async ({ event, context }) => {
  const { db, network } = context;
  const database = db;
  const { chainId } = network;

  const position =  await database.find(PositionSchema, {id: event.log.address.toLowerCase(), chainId});

  if (position) {
    await database.update(PositionSchema, {id: event.log.address.toLowerCase()}).set({
      chainId,
      owner: event.args.newOwner,
    });
  }

  await database.insert(ActiveUser).values({
    chainId,
    id: event.transaction.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
      lastActiveTime: event.block.timestamp,
  }))
});
