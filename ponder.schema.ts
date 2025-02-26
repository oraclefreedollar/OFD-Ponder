import {onchainTable, primaryKey} from '@ponder/core'

// -------------------------------------------------------------------------
// ORACLEFREEDOLLAR
// -------------------------------------------------------------------------

export const Mint = onchainTable('mint', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  to: t.text().notNull(),
  value: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));

export const Burn = onchainTable('burn', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  from: t.text().notNull(),
  value: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  timestamp: t.bigint().notNull(),
}));

export const MintBurnAddressMapper = onchainTable('mint_burn_address_mapper', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  mint: t.bigint().notNull(),
  burn: t.bigint().notNull(),
}));

export const Minter = onchainTable('minter', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  txHash: t.text().notNull(),
  minter: t.text().notNull(),
  applicationPeriod: t.bigint().notNull(),
  applicationFee: t.bigint().notNull(),
  applyMessage: t.text().notNull(),
  applyDate: t.bigint().notNull(),
  suggestor: t.text().notNull(),
  denyMessage: t.text(), // optional field
  denyDate: t.bigint(), // optional field
  denyTxHash: t.text(), // optional field
  vetor: t.text(), // optional field
}));

// -------------------------------------------------------------------------
// OFDPS
// -------------------------------------------------------------------------

export const VotingPower = onchainTable('voting_power', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  address: t.text().notNull(),
  votingPower: t.bigint().notNull(),
}));

export const OFDPS = onchainTable('ofdps', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  profits: t.bigint().notNull(),
  loss: t.bigint().notNull(),
  reserve: t.bigint().notNull(),
}));

export const Delegation = onchainTable('delegation', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  owner: t.text().notNull(),
  delegatedTo: t.text().notNull(),
}));

export const Trade = onchainTable('trade', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  trader: t.text().notNull(),
  amount: t.bigint().notNull(),
  shares: t.bigint().notNull(),
  price: t.bigint().notNull(),
  time: t.bigint().notNull(),
}));

export const TradeChart = onchainTable('trade_chart', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  time: t.bigint().notNull(),
  lastPrice: t.bigint().notNull(),
}));

// -------------------------------------------------------------------------
// MINTINGHUB >>> V2 Utils <<< SAVINGS AND ROLLER
// -------------------------------------------------------------------------

export const SavingsRateProposed = onchainTable('savings_rate_proposed', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  created: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  txHash: t.text().notNull(),
  proposer: t.text().notNull(),
  nextRate: t.integer().notNull(),
  nextChange: t.integer().notNull(),
}));

export const SavingsRateChanged = onchainTable('savings_rate_changed', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  created: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  txHash: t.text().notNull(),
  approvedRate: t.integer().notNull(),
}));

export const SavingsSaved = onchainTable('savings_saved', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  created: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  txHash: t.text().notNull(),
  account: t.text().notNull(),
  amount: t.bigint().notNull(),
  rate: t.integer().notNull(),
  total: t.bigint().notNull(),
  balance: t.bigint().notNull(),
}));

export const SavingsSavedMapping = onchainTable('savings_saved_mapping', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(), // address in lower case
  created: t.bigint().notNull(), // first timestamp
  blockheight: t.bigint().notNull(), // first blockheight
  updated: t.bigint().notNull(), // latest timestamp
  amount: t.bigint().notNull(), // total amount
}));

export const SavingsInterest = onchainTable('savings_interest', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  created: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  txHash: t.text().notNull(),
  account: t.text().notNull(),
  amount: t.bigint().notNull(),
  rate: t.integer().notNull(),
  total: t.bigint().notNull(),
  balance: t.bigint().notNull(),
}));

export const SavingsInterestMapping = onchainTable('savings_interest_mapping', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  created: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  updated: t.bigint().notNull(),
  amount: t.bigint().notNull(),
}));

export const SavingsWithdrawn = onchainTable('savings_withdrawn', (t => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  created: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  txHash: t.text().notNull(),
  account: t.text().notNull(),
  amount: t.bigint().notNull(),
  rate: t.integer().notNull(),
  total: t.bigint().notNull(),
  balance: t.bigint().notNull(),
})));

export const SavingsWithdrawnMapping = onchainTable('savings_withdrawn_mapping', (t => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  created: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  updated: t.bigint().notNull(),
  amount: t.bigint().notNull(),
})));

export const RollerRolled = onchainTable('roller_rolled', (t => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  created: t.bigint().notNull(),
  blockheight: t.bigint().notNull(),
  owner: t.text().notNull(),
  source: t.text().notNull(),
  collWithdraw: t.bigint().notNull(),
  repay: t.bigint().notNull(),
  target: t.text().notNull(),
  collDeposit: t.bigint().notNull(),
  mint: t.bigint().notNull(),
})));

// -------------------------------------------------------------------------
// MINTINGHUB >>> V2 <<<
// -------------------------------------------------------------------------

export const Position = onchainTable('position', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  position: t.text().notNull(),
  owner: t.text().notNull(),
  ofd: t.text().notNull(),
  collateral: t.text().notNull(),
  price: t.bigint().notNull(),
  created: t.bigint().notNull(),
  isOriginal: t.boolean().notNull(),
  isClone: t.boolean().notNull(),
  denied: t.boolean().notNull(),
  closed: t.boolean().notNull(),
  original: t.text().notNull(),
  minimumCollateral: t.bigint().notNull(),
  riskPremiumPPM: t.integer().notNull(),
  reserveContribution: t.integer().notNull(),
  start: t.integer().notNull(),
  cooldown: t.bigint().notNull(),
  expiration: t.integer().notNull(),
  challengePeriod: t.integer().notNull(),
  ofdName: t.text().notNull(),
  ofdSymbol: t.text().notNull(),
  ofdDecimals: t.integer().notNull(),
  collateralName: t.text().notNull(),
  collateralSymbol: t.text().notNull(),
  collateralDecimals: t.integer().notNull(),
  collateralBalance: t.bigint().notNull(),
  limitForClones: t.bigint().notNull(), // global limit for position and their clones
  availableForClones: t.bigint().notNull(), // for positions or clones for further clones
  availableForMinting: t.bigint().notNull(), // "unlocked" to mint for position
  minted: t.bigint().notNull(), // position minted amount
}));

export const MintingUpdate= onchainTable('minting_update', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  txHash: t.text().notNull(),
  created: t.bigint().notNull(),
  position: t.text().notNull(),
  owner: t.text().notNull(),
  isClone: t.boolean().notNull(),
  collateral: t.text().notNull(),
  collateralName: t.text().notNull(),
  collateralSymbol: t.text().notNull(),
  collateralDecimals: t.integer().notNull(),
  size: t.bigint().notNull(),
  price: t.bigint().notNull(),
  minted: t.bigint().notNull(),
  sizeAdjusted: t.bigint().notNull(),
  priceAdjusted: t.bigint().notNull(),
  mintedAdjusted: t.bigint().notNull(),
  annualInterestPPM: t.integer().notNull(),
  basePremiumPPM: t.integer().notNull(),
  riskPremiumPPM: t.integer().notNull(),
  reserveContribution: t.integer().notNull(),
  feeTimeframe: t.integer().notNull(),
  feePPM: t.integer().notNull(),
  feePaid: t.bigint().notNull(),
}));

export const Challenge= onchainTable('challenge', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(), // e.g. 0x5d0e66DC411FEfBE9cAe9CE56dA9BCE8C027f492-challenge-2
  position: t.text().notNull(), // position being challenged
  number: t.bigint().notNull(), // number of the challenge in minting hub
  challenger: t.text().notNull(),
  start: t.integer().notNull(), // timestamp for start of challenge
  created: t.bigint().notNull(), // block timestamp when challenge was created
  duration: t.integer().notNull(),
  size: t.bigint().notNull(), // size of the challenge, set by the challenger
  liqPrice: t.bigint().notNull(), // trigger price for challenge
  bids: t.bigint().notNull(), // number of bids, starting with 0
  filledSize: t.bigint().notNull(), // accumulated bids amounts, set by the bidders
  acquiredCollateral: t.bigint().notNull(), // total amount of collateral acquired, set by the bidders
  status: t.text().notNull(), // status: "Active" | "Success"
}));

export const ChallengeBid = onchainTable('challenge_bid', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(), // e.g. 0x5d0e66DC411FEfBE9cAe9CE56dA9BCE8C027f492-challenge-2-bid-0
  position: t.text().notNull(),
  number: t.bigint().notNull(),
  numberBid: t.bigint().notNull(),
  bidder: t.text().notNull(),
  created: t.bigint().notNull(), // block timestamp when bid was created
  bidType: t.text().notNull(), // "Averted" | "Succeeded"
  bid: t.bigint().notNull(), // bid amount
  price: t.bigint().notNull(), // bid price
  filledSize: t.bigint().notNull(),
  acquiredCollateral: t.bigint().notNull(),
  challengeSize: t.bigint().notNull(),
}));

// -------------------------------------------------------------------------
// COMMON
// -------------------------------------------------------------------------

export const ActiveUser = onchainTable('active_user', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  lastActiveTime: t.bigint().notNull(),
}));

export const Ecosystem = onchainTable('ecosystem', (t) => ({
  chainId: t.text().notNull(),
  id: t.text().primaryKey(),
  value: t.text().notNull(),
  amount: t.bigint().notNull(),
}));
