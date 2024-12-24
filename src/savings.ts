import { ponder } from '@/generated';
import { ADDR } from '../ponder.config';
import { Address } from 'viem';
import {
    Ecosystem,
    SavingsInterest,
    SavingsInterestMapping,
    SavingsRateChanged,
    SavingsRateProposed,
    SavingsSaved,
    SavingsSavedMapping,
    SavingsWithdrawn,
    SavingsWithdrawnMapping
} from '../ponder.schema'

ponder.on('Savings:RateProposed', async ({ event, context }) => {
    const database = context.db;
    const { who, nextChange, nextRate } = event.args;

    // flat indexing
    await database.insert(SavingsRateProposed).values({
        id: `${who.toLowerCase()}-${event.block.number}`,
        created: event.block.timestamp,
        blockheight: event.block.number,
        txHash: event.transaction.hash,
        proposer: who,
        nextRate: nextRate,
        nextChange: nextChange,
    });
});

ponder.on('Savings:RateChanged', async ({ event, context }) => {
    const database = context.db;
    const { newRate } = event.args;

    // flat indexing
    await database.insert(SavingsRateChanged).values({
        id: event.block.number.toString(),
        created: event.block.timestamp,
        blockheight: event.block.number,
        txHash: event.transaction.hash,
        approvedRate: newRate,
    });
});

ponder.on('Savings:Saved', async ({ event, context }) => {
    const { client, contracts } = context;
    const {Savings} = contracts;
    const database = context.db;
    const { amount } = event.args;
    const account: Address = event.args.account.toLowerCase() as Address;

    const ratePPM = await client.readContract({
        abi: Savings.abi,
        address: ADDR.savings,
        functionName: 'currentRatePPM',
    });

    // map indexing
    await database.insert(SavingsSavedMapping).values({
        id: account,
        created: event.block.timestamp,
        blockheight: event.block.number,
        updated: event.block.timestamp,
        amount,
    }).onConflictDoUpdate((current) => ({
        updated: event.block.timestamp,
        amount: current.amount + amount,
    }));

    const latestSaved = await database.find(SavingsSavedMapping, {id: account});
    const latestWithdraw = await database.find(SavingsWithdrawnMapping, {id: account});
    const latestInterest = await database.find(SavingsInterestMapping, {id: account});

    const balance: bigint = latestSaved
        ? latestSaved.amount - (latestWithdraw ? latestWithdraw.amount : 0n) + (latestInterest ? latestInterest.amount : 0n)
        : 0n;

    // flat indexing
    await database.insert(SavingsSaved).values({
        id: `${account}-${event.block.number.toString()}`,
        created: event.block.timestamp,
        blockheight: event.block.number,
        account: account,
        txHash: event.transaction.hash,
        amount,
        rate: ratePPM,
        total: latestSaved ? latestSaved.amount : amount,
        balance,
    }).onConflictDoNothing();

    // ecosystem
    await database.insert(Ecosystem).values({
        id: 'Savings:TotalSaved',
        value: '',
        amount: amount,
    }).onConflictDoUpdate((current) => ({
        amount: current.amount + amount,
    }));
});

ponder.on('Savings:InterestCollected', async ({ event, context }) => {
    const { client, contracts } = context;
    const { Savings } = contracts;
    const database = context.db;
    const { interest } = event.args;
    const account: Address = event.args.account.toLowerCase() as Address;

    const ratePPM = await client.readContract({
        abi: Savings.abi,
        address: ADDR.savings,
        functionName: 'currentRatePPM',
    });

    // map indexing

    await database.insert(SavingsInterestMapping).values({
        id: account,
        created: event.block.timestamp,
        blockheight: event.block.number,
        updated: event.block.timestamp,
        amount: interest,
    }).onConflictDoUpdate((current) => ({
        updated: event.block.timestamp,
        amount: current.amount + interest,
    }));

    const latestSaved = await database.find(SavingsSavedMapping, {id: account});
    const latestWithdraw = await database.find(SavingsWithdrawnMapping, {id: account});
    const latestInterest = await database.find(SavingsInterestMapping, {id: account});

    const balance: bigint = latestSaved
        ? latestSaved.amount - (latestWithdraw ? latestWithdraw.amount : 0n) + (latestInterest ? latestInterest.amount : 0n)
        : 0n;

    // flat indexing

    await database.insert(SavingsInterest).values({
        id: `${account}-${event.block.number.toString()}`,
        created: event.block.timestamp,
        blockheight: event.block.number,
        txHash: event.transaction.hash,
        account: account,
        amount: interest,
        rate: ratePPM,
        total: latestInterest ? latestInterest.amount : interest,
        balance,
    }).onConflictDoNothing();

    // ecosystem

    await database.insert(Ecosystem).values({
        id: 'Savings:TotalInterestCollected',
        value: '',
        amount: interest,
    }).onConflictDoUpdate((current) => ({
        amount: current.amount + interest,
    }));
});

ponder.on('Savings:Withdrawn', async ({ event, context }) => {
    const { client, contracts } = context;
    const { Savings } = contracts;
    const database = context.db;
    const { amount } = event.args;
    const account: Address = event.args.account.toLowerCase() as Address;

    const ratePPM = await client.readContract({
        abi: Savings.abi,
        address: ADDR.savings,
        functionName: 'currentRatePPM',
    });

    // map indexing
    await database.insert(SavingsWithdrawnMapping).values({
        id: account,
        created: event.block.timestamp,
        blockheight: event.block.number,
        updated: event.block.timestamp,
        amount,
    }).onConflictDoUpdate((current) => ({
        updated: event.block.timestamp,
        amount: current.amount + amount,
    }));

    const latestSaved = await database.find(SavingsSavedMapping, {id: account});
    const latestWithdraw = await database.find(SavingsWithdrawnMapping, {id: account});
    const latestInterest = await database.find(SavingsInterestMapping, {id: account});


    const balance: bigint = latestSaved
        ? latestSaved.amount - (latestWithdraw ? latestWithdraw.amount : 0n) + (latestInterest ? latestInterest.amount : 0n)
        : 0n;

    // flat indexing
    await database.insert(SavingsWithdrawn).values({
        id: `${account}-${event.block.number.toString()}`,
        created: event.block.timestamp,
        blockheight: event.block.number,
        txHash: event.transaction.hash,
        account: account,
        amount,
        rate: ratePPM,
        total: latestWithdraw ? latestWithdraw.amount : amount,
        balance,
    }).onConflictDoNothing();

    // ecosystem
    await database.insert(Ecosystem).values({
        id: 'Savings:TotalWithdrawn',
        value: '',
        amount: amount,
    }).onConflictDoUpdate((current) => ({
        amount: current.amount + amount,
    }));
});
