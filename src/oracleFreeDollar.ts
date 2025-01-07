import { ponder } from "@/generated";
import { Address, zeroAddress } from 'viem';
import {ActiveUser, Burn, Ecosystem, Mint, MintBurnAddressMapper, Minter, OFDPS} from '../ponder.schema'

ponder.on('OracleFreeDollar:Profit', async ({ event, context }) => {
  const database = context.db;

  await database.insert(Ecosystem).values({
    id: 'Equity:ProfitCounter',
    value: '',
    amount: 1n,
  }).onConflictDoUpdate((current)=> ({
    amount: current.amount + 1n,
  }));

  await database.insert(OFDPS).values({
    id: event.log.address.toLowerCase(),
    profits: event.args.amount,
    loss: 0n,
    reserve: 0n,
  }).onConflictDoUpdate((current)=> ({
    profits: current.profits + event.args.amount,
  }));

  await database.insert(ActiveUser).values({
    id: event.transaction.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
    lastActiveTime: event.block.timestamp,
  }));
});

ponder.on('OracleFreeDollar:Loss', async ({ event, context }) => {
  const database = context.db;

  await database.insert(Ecosystem).values({
    id: 'Equity:LossCounter',
    value: '',
    amount: 1n,
  }).onConflictDoUpdate((current)=> ({
    amount: current.amount + 1n,
  }));

  await database.insert(OFDPS).values({
    id: event.log.address.toLowerCase(),
    profits: 0n,
    loss: event.args.amount,
    reserve: 0n,
  }).onConflictDoUpdate((current)=> ({
    loss: current.loss + event.args.amount,
  }));

  await database.insert(ActiveUser).values({
    id: event.transaction.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
    lastActiveTime: event.block.timestamp,
  }));
});

ponder.on('OracleFreeDollar:MinterApplied', async ({ event, context }) => {
  const database = context.db;

  await database.insert(Ecosystem).values({
    id: 'OracleFreeDollar:MinterAppliedCounter',
    value: '',
    amount: 1n,
  }).onConflictDoUpdate((current)=> ({
    amount: current.amount + 1n,
  }));

  await database.insert(Minter).values({
    id: event.args.minter,
    txHash: event.transaction.hash,
    minter: event.args.minter,
    applicationPeriod: event.args.applicationPeriod,
    applicationFee: event.args.applicationFee,
    applyMessage: event.args.message,
    applyDate: event.block.timestamp,
    suggestor: event.transaction.from,
  }).onConflictDoUpdate((current)=> ({
    txHash: event.transaction.hash,
    minter: event.args.minter,
    applicationPeriod: event.args.applicationPeriod,
    applicationFee: event.args.applicationFee,
    applyMessage: event.args.message,
    applyDate: event.block.timestamp,
    suggestor: event.transaction.from,
    denyDate: undefined,
    denyMessage: undefined,
    denyTxHash: undefined,
    vetor: undefined,
  }));

  await database.insert(ActiveUser).values({
    id: event.transaction.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
    lastActiveTime: event.block.timestamp,
  }));
});

ponder.on('OracleFreeDollar:MinterDenied', async ({ event, context }) => {
  const database = context.db;

  await database.insert(Ecosystem).values({
    id: 'OracleFreeDollar:MinterDeniedCounter',
    value: '',
    amount: 1n,
  }).onConflictDoUpdate((current)=> ({
    amount: current.amount + 1n,
  }));

  await database.update(Minter, {id: event.args.minter}).set( (row) => ({
    denyMessage: event.args.message,
    denyDate: event.block.timestamp,
    denyTxHash: event.transaction.hash,
    vetor: event.transaction.from,
  }));

  await database.insert(ActiveUser).values({
    id: event.transaction.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate((current)=> ({
    lastActiveTime: event.block.timestamp,
  }));
});

ponder.on('OracleFreeDollar:Transfer', async ({ event, context }) => {
  const database = context.db;

  await database.insert(Ecosystem).values({
    id: 'OracleFreeDollar:TransferCounter',
    value: '',
    amount: 1n,
  }).onConflictDoUpdate((current)=> ({
    amount: current.amount + 1n,
  }))

  // emit Transfer(address(0), recipient, amount);
  if (event.args.from === zeroAddress) {
    await database.insert(Mint).values({
      id: `${event.args.to}-mint-${event.block.number}`,
      to: event.args.to,
      value: event.args.value,
      blockheight: event.block.number,
      timestamp: event.block.timestamp,
    }).onConflictDoNothing()

    await database.insert(Ecosystem).values({
      id: 'OracleFreeDollar:MintCounter',
      value: '',
      amount: 1n,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + 1n,
    }));

    await database.insert(Ecosystem).values({
      id: 'OracleFreeDollar:Mint',
      value: '',
      amount: event.args.value,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + event.args.value,
    }));

    await database.insert(MintBurnAddressMapper).values({
      id: event.args.to.toLowerCase(),
      mint: event.args.value,
      burn: 0n,
    }).onConflictDoUpdate((current)=> ({
      mint: current.mint + event.args.value,
    }));

    await database.insert(ActiveUser).values({
      id: event.transaction.to as Address,
      lastActiveTime: event.block.timestamp,
    }).onConflictDoUpdate((current)=> ({
      lastActiveTime: event.block.timestamp,
    }));
  }

  // emit Transfer(account, address(0), amount);
  if (event.args.to === zeroAddress) {
    await database.insert(Burn).values({
      id: `${event.args.from}-burn-${event.block.number}`,
      from: event.args.from,
      value: event.args.value,
      blockheight: event.block.number,
      timestamp: event.block.timestamp,
    }).onConflictDoNothing();

    await database.insert(Ecosystem).values({
      id: 'OracleFreeDollar:BurnCounter',
      value: '',
      amount: 1n,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + 1n,
    }));

    await database.insert(Ecosystem).values({
      id: 'OracleFreeDollar:Burn',
      value: '',
      amount: event.args.value,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + event.args.value,
    }));

    await database.insert(MintBurnAddressMapper).values({
      id: event.args.from.toLowerCase(),
      mint: 0n,
      burn: event.args.value,
    }).onConflictDoUpdate((current)=> ({
      burn: current.burn + event.args.value,
    }));

    await database.insert(ActiveUser).values({
      id: event.transaction.from,
      lastActiveTime: event.block.timestamp,
    }).onConflictDoUpdate((current)=> ({
      lastActiveTime: event.block.timestamp,
    }));
  }
});
