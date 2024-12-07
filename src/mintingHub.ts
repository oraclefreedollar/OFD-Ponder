import { ponder } from "@/generated";
import {ABIs} from '../abis'

// event PositionOpened(address indexed owner, address indexed position, address original, address collateral);
ponder.on('MintingHub:PositionOpened', async ({ event, context }) => {
  const { client } = context;
  const { Position, ActiveUser, Ecosystem } = context.db;

  // ------------------------------------------------------------------
  // FROM EVENT & TRANSACTION
  const { owner, position, original, collateral } = event.args;

  const created: bigint = event.block.timestamp;

  const isOriginal: boolean = original.toLowerCase() === position.toLowerCase();
  const isClone: boolean = !isOriginal;
  const closed: boolean = false;
  const denied: boolean = false;

  // ------------------------------------------------------------------
  // CONST
  const ofd = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'ofd',
  });

  const minimumCollateral = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'minimumCollateral',
  });

  const riskPremiumPPM = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'riskPremiumPPM',
  });

  const reserveContribution = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'reserveContribution',
  });

  const start = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'start',
  });

  const expiration = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'expiration',
  });

  const challengePeriod = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'challengePeriod',
  });

  const limitForClones = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'limit',
  });

  // ------------------------------------------------------------------
  // ofd ERC20
  const ofdName = await client.readContract({
    abi: ABIs.ERC20,
    address: ofd,
    functionName: 'name',
  });

  const ofdSymbol = await client.readContract({
    abi: ABIs.ERC20,
    address: ofd,
    functionName: 'symbol',
  });

  const ofdDecimals = await client.readContract({
    abi: ABIs.ERC20,
    address: ofd,
    functionName: 'decimals',
  });

  // ------------------------------------------------------------------
  // COLLATERAL ERC20
  const collateralName = await client.readContract({
    abi: ABIs.ERC20,
    address: collateral,
    functionName: 'name',
  });

  const collateralSymbol = await client.readContract({
    abi: ABIs.ERC20,
    address: collateral,
    functionName: 'symbol',
  });

  const collateralDecimals = await client.readContract({
    abi: ABIs.ERC20,
    address: collateral,
    functionName: 'decimals',
  });

  const collateralBalance = await client.readContract({
    abi: ABIs.ERC20,
    address: collateral,
    functionName: 'balanceOf',
    args: [position],
  });

  // ------------------------------------------------------------------
  // CHANGEABLE
  const price = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'price',
  });

  const availableForClones = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'availableForClones',
  });

  const availableForMinting = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'availableForMinting',
  });

  const minted = await client.readContract({
    abi: ABIs.Position,
    address: position,
    functionName: 'minted',
  });

  const cooldown = await client.readContract({
    abi: ABIs.Position,
    address: event.args.position,
    functionName: 'cooldown',
  });

  // ------------------------------------------------------------------
  // CALC VALUES
  // const priceAdjusted = price / BigInt(10 ** (36 - collateralDecimals));
  const limitForPosition = (collateralBalance * price) / BigInt(10 ** ofdDecimals);
  const availableForPosition = limitForPosition - minted;

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // If clone, update original position
  if (isClone) {
    const originalAvailableForClones = await client.readContract({
      abi: ABIs.Position,
      address: original,
      functionName: 'availableForClones',
    });

    const originalAvailableForMinting = await client.readContract({
      abi: ABIs.Position,
      address: original,
      functionName: 'availableForMinting',
    });

    await Position.update({
      id: original.toLowerCase(),
      data: {
        availableForClones: originalAvailableForClones,
        availableForMinting: originalAvailableForMinting,
      },
    });
  }

  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // ------------------------------------------------------------------
  // Create position entry for DB
  await Position.create({
    id: position.toLowerCase(),
    data: {
      position,
      owner,
      ofd,
      collateral,
      price,

      created,
      isOriginal,
      isClone,
      denied,
      closed,
      original,

      minimumCollateral,
      riskPremiumPPM,
      reserveContribution,
      start,
      cooldown: BigInt(cooldown),
      expiration,
      challengePeriod,

      ofdName,
      ofdSymbol,
      ofdDecimals,

      collateralName,
      collateralSymbol,
      collateralDecimals,
      collateralBalance,

      limitForClones,
      availableForClones,
      availableForMinting,
      minted,
    },
  });

  // ------------------------------------------------------------------
  // COMMON

  await Ecosystem.upsert({
    id: 'MintingHub:TotalPositions',
    create: {
      value: '',
      amount: 1n,
    },
    update: ({ current }) => ({
      amount: current.amount + 1n,
    }),
  });

  await ActiveUser.upsert({
    id: event.transaction.from,
    create: {
      lastActiveTime: event.block.timestamp,
    },
    update: () => ({
      lastActiveTime: event.block.timestamp,
    }),
  });
});

ponder.on('MintingHub:ChallengeStarted', async ({ event, context }) => {
  const { client } = context;
  const { Challenge, ActiveUser, Ecosystem } = context.db;
  const { MintingHub } = context.contracts;

  const challenges = await client.readContract({
    abi: MintingHub.abi,
    address: MintingHub.address,
    functionName: 'challenges',
    args: [event.args.number],
  });

  const period = await client.readContract({
    abi: ABIs.Position,
    address: event.args.position,
    functionName: 'challengePeriod',
  });

  const liqPrice = await client.readContract({
    abi: ABIs.Position,
    address: event.args.position,
    functionName: 'price',
  });

  await Challenge.create({
    id: getChallengeId(event.args.position, event.args.number),
    data: {
      position: event.args.position,
      number: event.args.number,

      challenger: event.args.challenger,
      start: challenges[1],
      created: event.block.timestamp,
      duration: period,
      size: event.args.size,
      liqPrice,

      bids: 0n,
      filledSize: 0n,
      acquiredCollateral: 0n,
      status: 'Active',
    },
  });

  // ------------------------------------------------------------------
  // COMMON
  await Ecosystem.upsert({
    id: 'MintingHub:TotalChallenges',
    create: {
      value: '',
      amount: 1n,
    },
    update: ({ current }) => ({
      amount: current.amount + 1n,
    }),
  });

  await ActiveUser.upsert({
    id: event.transaction.from,
    create: {
      lastActiveTime: event.block.timestamp,
    },
    update: () => ({
      lastActiveTime: event.block.timestamp,
    }),
  });
});

// event ChallengeAverted(address indexed position, uint256 number, uint256 size);
ponder.on('MintingHub:ChallengeAverted', async ({ event, context }) => {
  const { client } = context;
  const { Position, Challenge, ChallengeBid, ActiveUser, Ecosystem } = context.db;
  const { MintingHub } = context.contracts;

  // console.log('ChallengeAverted', event.args);

  const challenges = await client.readContract({
    abi: MintingHub.abi,
    address: MintingHub.address,
    functionName: 'challenges',
    args: [event.args.number],
  });

  // console.log('ChallengeAverted:challenges', challenges);

  const cooldown = await client.readContract({
    abi: ABIs.Position,
    address: event.args.position,
    functionName: 'cooldown',
  });

  const liqPrice = await client.readContract({
    abi: ABIs.Position,
    address: event.args.position,
    functionName: 'price',
  });

  const challengeId = getChallengeId(event.args.position, event.args.number);
  const challenge = await Challenge.findUnique({
    id: challengeId,
  });

  if (!challenge) throw new Error('ChallengeV1 not found');

  const challengeBidId = getChallengeBidId(event.args.position, event.args.number, challenge.bids);

  const _price: number = parseInt(liqPrice.toString());
  const _size: number = parseInt(event.args.size.toString());
  const _amount: number = (_price / 1e18) * _size;

  // create ChallengeBid entry
  await ChallengeBid.create({
    id: challengeBidId,
    data: {
      position: event.args.position,
      number: event.args.number,
      numberBid: challenge.bids,
      bidder: event.transaction.from,
      created: event.block.timestamp,
      bidType: 'Averted',
      bid: BigInt(_amount),
      price: liqPrice,
      filledSize: event.args.size,
      acquiredCollateral: 0n,
      challengeSize: challenge.size,
    },
  });

  // update Challenge related changes
  await Challenge.update({
    id: challengeId,
    data: ({ current }) => ({
      bids: current.bids + 1n,
      filledSize: current.filledSize + event.args.size,
      status: challenges[3] === 0n ? 'Success' : current.status,
    }),
  });

  // update Position related changes
  await Position.update({
    id: event.args.position.toLowerCase(),
    data: { cooldown: BigInt(cooldown) },
  });

  // ------------------------------------------------------------------
  // COMMON
  await Ecosystem.upsert({
    id: 'MintingHub:TotalAvertedBids',
    create: {
      value: '',
      amount: 1n,
    },
    update: ({ current }) => ({
      amount: current.amount + 1n,
    }),
  });

  await ActiveUser.upsert({
    id: event.transaction.from,
    create: {
      lastActiveTime: event.block.timestamp,
    },
    update: () => ({
      lastActiveTime: event.block.timestamp,
    }),
  });
});

// event ChallengeSucceeded(
// 	address indexed position,
// 	uint256 number,
// 	uint256 bid,
// 	uint256 acquiredCollateral,
// 	uint256 challengeSize
// );
// emit ChallengeSucceeded(address(_challenge.position), _challengeNumber, offer, transferredCollateral, size);
ponder.on('MintingHub:ChallengeSucceeded', async ({ event, context }) => {
  const { client } = context;
  const { Position, Challenge, ChallengeBid, ActiveUser, Ecosystem } = context.db;
  const { MintingHub } = context.contracts;

  // console.log('ChallengeSucceeded', event.args);

  const challenges = await client.readContract({
    abi: MintingHub.abi,
    address: MintingHub.address,
    functionName: 'challenges',
    args: [event.args.number],
  });

  // console.log('ChallengeSucceeded:challenges', challenges);

  const cooldown = await client.readContract({
    abi: ABIs.Position,
    address: event.args.position,
    functionName: 'cooldown',
  });

  const challengeId = getChallengeId(event.args.position, event.args.number);
  const challenge = await Challenge.findUnique({
    id: challengeId,
  });

  if (!challenge) throw new Error('ChallengeV1 not found');

  const challengeBidId = getChallengeBidId(event.args.position, event.args.number, challenge.bids);

  const _bid: number = parseInt(event.args.bid.toString());
  const _size: number = parseInt(event.args.challengeSize.toString());
  const _price: number = (_bid * 10 ** 18) / _size;

  // create ChallengeBidV1 entry
  await ChallengeBid.create({
    id: challengeBidId,
    data: {
      position: event.args.position,
      number: event.args.number,
      numberBid: challenge.bids,
      bidder: event.transaction.from,
      created: event.block.timestamp,
      bidType: 'Succeeded',
      bid: event.args.bid,
      price: BigInt(_price),
      filledSize: event.args.challengeSize,
      acquiredCollateral: event.args.acquiredCollateral,
      challengeSize: challenge.size,
    },
  });

  await Challenge.update({
    id: challengeId,
    data: ({ current }) => ({
      bids: current.bids + 1n,
      acquiredCollateral: current.acquiredCollateral + event.args.acquiredCollateral,
      filledSize: current.filledSize + event.args.challengeSize,
      status: challenges[3] === 0n ? 'Success' : current.status,
    }),
  });

  await Position.update({
    id: event.args.position.toLowerCase(),
    data: { cooldown: BigInt(cooldown) },
  });

  // ------------------------------------------------------------------
  // COMMON
  await Ecosystem.upsert({
    id: 'MintingHub:TotalSucceededBids',
    create: {
      value: '',
      amount: 1n,
    },
    update: ({ current }) => ({
      amount: current.amount + 1n,
    }),
  });

  await ActiveUser.upsert({
    id: event.transaction.from,
    create: {
      lastActiveTime: event.block.timestamp,
    },
    update: () => ({
      lastActiveTime: event.block.timestamp,
    }),
  });
});

const getChallengeId = (position: string, number: bigint) => {
  return `${position.toLowerCase()}-challenge-${number}`;
};

const getChallengeBidId = (position: string, number: bigint, bid: bigint) => {
  return `${position.toLowerCase()}-challenge-${number}-bid-${bid}`;
};
