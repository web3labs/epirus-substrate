import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Account, Balance, Events, Extrinsic } from "../model";
import { getOrCreateAccount, createExtrinsic, createEvent } from "../entities";
import {
  EnhancedBalancesTransferEvent,
  EnhancedSystemAccountStorage,
} from "../enhanced-types";

export async function balancesTransferEventHandler(
  ctx: EventHandlerContext
): Promise<void> {
  console.log("Got balances transfer event!");
  const { store, block, event, extrinsic } = ctx;
  const { from, to } = new EnhancedBalancesTransferEvent(ctx).resolve();

  // Balances could also be stored in Balances.Account storage (either/or)
  // It is defined in the runtime config of balances pallet `type AccountStore = System;`
  // We should check if one is empty (all balances = 0), then use the other
  const accountStorage = new EnhancedSystemAccountStorage(ctx);
  const fromBalances = await accountStorage.get(from);
  const toBalances = await accountStorage.get(to);

  const fromAcc = await getOrCreateAccount(
    ctx.store,
    from,
    new Balance({
      free: fromBalances.data.free,
      reserved: fromBalances.data.reserved,
      miscFrozen: fromBalances.data.miscFrozen,
      feeFrozen: fromBalances.data.feeFrozen,
    })
  );

  const toAcc = await getOrCreateAccount(
    ctx.store,
    to,
    new Balance({
      free: toBalances.data.free,
      reserved: toBalances.data.reserved,
      miscFrozen: toBalances.data.miscFrozen,
      feeFrozen: toBalances.data.feeFrozen,
    })
  );

  const entities: Array<Account | Extrinsic | Events> = [fromAcc, toAcc];

  if (extrinsic) {
    const extrinsicEntity = createExtrinsic(extrinsic, block);
    const eventEntity = createEvent(extrinsicEntity, event);
    entities.push(extrinsicEntity, eventEntity);
  }

  await store.save(entities);
}
