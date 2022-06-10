import * as ss58 from "@subsquid/ss58";
import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Balance } from "../model";
import { BalancesTransferEvent } from "../types/events";
import { SystemAccountStorage } from "../types/storage";
import * as store from "./storeUtils"

export async function balancesTransferEventHandler(ctx: EventHandlerContext): Promise<void> {
  console.log("Got balances transfer event!");
  const transfer = getTransferEvent(ctx);
  const from = ss58.codec("substrate").encode(transfer.from);
  const to = ss58.codec("substrate").encode(transfer.to);

  // Balances could also be stored in Balances.Account storage (either/or)
  // It is defined in the runtime config of balances pallet `type AccountStore = System;`
  // We should check if one is empty (all balances = 0), then use the other
  const accountStorage = new SystemAccountStorage(ctx);
  const fromBalances = await accountStorage.getAsV100(transfer.from);
  const toBalances = await accountStorage.getAsV100(transfer.to);

  const fromAcc = await store.getOrCreateAccount(ctx.store, from, new Balance({
    free: fromBalances.data.free,
    reserved: fromBalances.data.reserved,
    miscFrozen: fromBalances.data.miscFrozen,
    feeFrozen: fromBalances.data.feeFrozen
  }));
  await ctx.store.save(fromAcc);

  const toAcc = await store.getOrCreateAccount(ctx.store, to, new Balance({
    free: toBalances.data.free,
    reserved: toBalances.data.reserved,
    miscFrozen: toBalances.data.miscFrozen,
    feeFrozen: toBalances.data.feeFrozen
  }));
  await ctx.store.save(toAcc);
}

interface TransferEvent {
  from: Uint8Array;
  to: Uint8Array;
  amount: bigint;
}

function getTransferEvent(ctx: EventHandlerContext): TransferEvent {
  const event = new BalancesTransferEvent(ctx);
  const {from, to, amount} = event.asV100;
  return { from, to, amount };
}