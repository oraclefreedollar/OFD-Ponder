import { ponder } from '@/generated';
import {RollerRolled} from '../ponder.schema'

ponder.on('Roller:Roll', async ({ event, context }) => {
    const { db, network } = context;
    const database = db;
    const { chainId } = network;
    const { source, collWithdraw, repay, target, collDeposit, mint } = event.args;

    // flat indexing
    await database.insert(RollerRolled).values({
        chainId,
        id: `${source.toLowerCase()}-${target.toLowerCase()}-${event.block.number}`,
        created: event.block.timestamp,
        blockheight: event.block.number,
        owner: event.transaction.from,
        source,
        collWithdraw,
        repay,
        target,
        collDeposit,
        mint,
    });
});
