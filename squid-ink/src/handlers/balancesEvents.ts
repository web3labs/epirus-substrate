import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { Account, Balance, Events, Extrinsic } from "../model";
import { getOrCreateAccount, createExtrinsic, createEvent } from "../entities";
import {
  NormalisedBalancesTransferEvent,
  NormalisedSystemAccountStorage,
} from "../normalised-types";

export async function balancesTransferEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got balances transfer event!");
  const { store, block, event, extrinsic } = ctx;
  const { from, to } = new NormalisedBalancesTransferEvent(ctx).resolve();

  // TODO: resolve balances based on right storage
  // Balances could also be stored in Balances.Account storage (either/or)
  // It is defined in the runtime config of balances pallet `type AccountStore = System;`
  // We should check if one is empty (all balances = 0), then use the other
  const accountStorage = new NormalisedSystemAccountStorage(ctx);
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
