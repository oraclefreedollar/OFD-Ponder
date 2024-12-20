import { ponder } from "@/generated";
import { Address, zeroAddress } from 'viem';
import {ActiveUser, Delegation, Ecosystem, Trade, TradeChart, VotingPower} from '../ponder.schema'

ponder.on('Equity:Trade', async ({ event, context }) => {
  const database = context.db;
  const trader: Address = event.args.who;
  const amount: bigint = event.args.totPrice;
  const shares: bigint = event.args.amount;
  const price: bigint = event.args.newprice;
  const time: bigint = event.block.timestamp;

  await database.insert(Trade).values({
    id: event.args.who + '_' + time.toString(),
    trader,
    amount,
    shares,
    price,
    time,
  });

  // invested or redeemed
  if (shares > 0n) {
    // cnt
    await database.insert(Ecosystem).values({
        id: 'Equity:InvestedCounter',
        value: '',
        amount: 1n,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + 1n,
    }))

    // accum.
    await database.insert(Ecosystem).values({
      id: 'Equity:Invested',
      value: '',
      amount: 0n,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + amount,
    }));

    // calc fee PPM for raw data
    await database.insert(Ecosystem).values({
      id: 'Equity:InvestedFeePaidPPM',
      value: '',
      amount: 0n,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + amount * 3000n,
    }));

  } else {
    // cnt
    await database.insert(Ecosystem).values({
      id: 'Equity:RedeemedCounter',
      value: '',
      amount: 1n,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + 1n,
    }));

    // accum.
    await database.insert(Ecosystem).values({
      id: 'Equity:Redeemed',
      value: '',
      amount: 0n,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + amount,
    }));

    // calc fee PPM for raw data
    await database.insert(Ecosystem).values({
      id: 'Equity:RedeemedFeePaidPPM',
      value: '',
      amount: 0n,
    }).onConflictDoUpdate((current)=> ({
      amount: current.amount + amount * 3000n,
    }));
  }

  await database.insert(VotingPower).values({
    id: event.args.who,
    address: event.args.who,
    votingPower: event.args.amount,
  }).onConflictDoUpdate((current)=> ({
    votingPower: current.votingPower + event.args.amount,
  }));

  await database.insert(TradeChart).values({
    id: time.toString(),
    time,
    lastPrice: event.args.newprice,
    }).onConflictDoUpdate((current)=> ({
      lastPrice: event.args.newprice,
    }));

  await database.insert(ActiveUser).values({
    id: event.args.who,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate(()=> ({
    lastActiveTime: event.block.timestamp,
  }));
});

ponder.on('Equity:Transfer', async ({ event, context }) => {
  const database = context.db;

  if (event.args.from == zeroAddress || event.args.to == zeroAddress) return;

  await database.update(VotingPower, {id: event.args.from}).set( (row) => {
    return {
      votingPower: row.votingPower - BigInt(event.args.value),
    }
  })

  await database.insert(VotingPower).values({
    id: event.args.to,
    address: event.args.to,
    votingPower: event.args.value,
  }).onConflictDoUpdate((current)=> ({
    votingPower: current.votingPower + event.args.value,
  }));

  await database.insert(ActiveUser).values({
    id: event.args.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate(()=> ({
    lastActiveTime: event.block.timestamp,
  }));

  await database.insert(ActiveUser).values({
    id: event.args.to,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate(()=> ({
    lastActiveTime: event.block.timestamp,
  }));
});

ponder.on('Equity:Delegation', async ({ event, context }) => {
  const database = context.db;

  await database.insert(Delegation).values({
    id: event.args.from,
    owner: event.args.from,
    delegatedTo: event.args.to,
  }).onConflictDoUpdate(()=> ({
    delegatedTo: event.args.to,
  }));

  await database.insert(ActiveUser).values({
    id: event.args.from,
    lastActiveTime: event.block.timestamp,
  }).onConflictDoUpdate(()=> ({
    lastActiveTime: event.block.timestamp,
  }));
});
