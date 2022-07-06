import {
  NormalisedBalancesEndowedEvent,
  NormalisedBalancesReservedEvent,
  NormalisedBalancesTransferEvent,
  NormalisedBalancesWithdrawEvent,
} from "@chain/normalised-types";
import { EventHandlerParams } from "../types";
import {
  createEvent,
  createExtrinsic,
  updateAccountBalance,
} from "../../entity-utils";

export async function handleBalancesTransfer<P>({
  ctx,
  event,
  block,
}: EventHandlerParams<P>): Promise<void> {
  const { log } = ctx;
  log.debug({ block: block.height }, "Got balances Transfer event!");
  try {
    const { from, to } = new NormalisedBalancesTransferEvent(
      ctx,
      event
    ).resolve();
    await updateEntities({ ctx, event, block, accounts: [from, to] });
  } catch (error) {
    log.error(<Error>error, "Error handling balances Transfer event.");
  }
}

export async function handleBalancesWithdraw<P>({
  ctx,
  event,
  block,
}: EventHandlerParams<P>): Promise<void> {
  const { log } = ctx;
  log.debug({ block: block.height }, "Got balances Withdraw event!");
  try {
    const { account } = new NormalisedBalancesWithdrawEvent(
      ctx,
      event
    ).resolve();
    await updateEntities({ ctx, event, block, accounts: [account] });
  } catch (error) {
    log.error(<Error>error, "Error handling balances Withdraw event.");
  }
}

export async function handleBalancesReserved<P>({
  ctx,
  event,
  block,
}: EventHandlerParams<P>): Promise<void> {
  const { log } = ctx;
  log.debug({ block: block.height }, "Got balances Reserved event!");
  try {
    const { account } = new NormalisedBalancesReservedEvent(
      ctx,
      event
    ).resolve();
    await updateEntities({ ctx, event, block, accounts: [account] });
  } catch (error) {
    log.error(<Error>error, "Error handling balances Reserved event.");
  }
}

export async function handleBalancesEndowed<P>({
  ctx,
  event,
  block,
}: EventHandlerParams<P>): Promise<void> {
  const { log } = ctx;
  log.debug({ block: block.height }, "Got balances Endowed event!");
  try {
    const { account } = new NormalisedBalancesEndowedEvent(
      ctx,
      event
    ).resolve();
    await updateEntities({ ctx, event, block, accounts: [account] });
  } catch (error) {
    log.error(<Error>error, "Error handling balances Endowed event.");
  }
}

async function updateEntities<P>({
  ctx,
  event,
  block,
  accounts,
}: EventHandlerParams<P> & { accounts: string[] }): Promise<void> {
  const { store, log } = ctx;
  const { extrinsic, call } = event;
  for (const account of accounts) {
    const accountEntity = await updateAccountBalance(ctx, account, block);
    await store.save(accountEntity);
  }
  if (extrinsic && call) {
    const extrinsicEntity = createExtrinsic(extrinsic, call, block, log);
    const eventEntity = createEvent(extrinsicEntity, event);
    await store.save(extrinsicEntity);
    await store.save(eventEntity);
  }
}
