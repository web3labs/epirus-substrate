import * as ss58 from "@subsquid/ss58";
import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Balance } from "../model";
import { BalancesTransferEvent } from "../types/events";
import { SystemAccountStorage } from "../types/storage";
import { getOrCreateAccount } from "./storeUtils"
import { createExtrinsic, createEvent } from "./utils";

export async function balancesTransferEventHandler(ctx: EventHandlerContext): Promise<void> {
  console.log("Got balances transfer event!");
  const { store, block, event, extrinsic } = ctx;
  const ev = new BalancesTransferEvent(ctx);
  const { from, to } = ev.asV100;
  const fromAddress = ss58.codec("substrate").encode(from);
  const toAddress = ss58.codec("substrate").encode(to);

  // Balances could also be stored in Balances.Account storage (either/or)
  // It is defined in the runtime config of balances pallet `type AccountStore = System;`
  // We should check if one is empty (all balances = 0), then use the other
  const accountStorage = new SystemAccountStorage(ctx);
  const fromBalances = await accountStorage.getAsV100(from);
  const toBalances = await accountStorage.getAsV100(to);

  const fromAcc = await getOrCreateAccount(ctx.store, fromAddress, new Balance({
    free: fromBalances.data.free,
    reserved: fromBalances.data.reserved,
    miscFrozen: fromBalances.data.miscFrozen,
    feeFrozen: fromBalances.data.feeFrozen
  }));

  const toAcc = await getOrCreateAccount(ctx.store, toAddress, new Balance({
    free: toBalances.data.free,
    reserved: toBalances.data.reserved,
    miscFrozen: toBalances.data.miscFrozen,
    feeFrozen: toBalances.data.feeFrozen
  }));

  const entities: any[] = [
    fromAcc,
    toAcc
  ]

  if (extrinsic) {
    const extrinsicEntity = createExtrinsic(extrinsic, block);
    const eventEntity = createEvent(extrinsicEntity, event);
    entities.push(extrinsicEntity, eventEntity)
  }

  await store.save(entities);
}
