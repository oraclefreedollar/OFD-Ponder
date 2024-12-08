import { ponder } from '@/generated';
import {RollerRolled} from '../ponder.schema'

ponder.on('Roller:Roll', async ({ event, context }) => {
    const database = context.db;
    const { source, collWithdraw, repay, target, collDeposit, mint } = event.args;

    // flat indexing
    await database.insert(RollerRolled).values({
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
