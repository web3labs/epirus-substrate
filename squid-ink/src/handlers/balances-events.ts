import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { Account, Events, Extrinsic } from "../model";
import {
  updateAccountBalance,
  createExtrinsic,
  createEvent,
} from "../entity-utils";
import {
  NormalisedBalancesEndowedEvent,
  NormalisedBalancesReservedEvent,
  NormalisedBalancesTransferEvent,
  NormalisedBalancesWithdrawEvent,
} from "../normalised-types";

export async function balancesTransferEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got balances Transfer event!");
  try {
    const { store, block, event, extrinsic } = ctx;
    const { from, to } = new NormalisedBalancesTransferEvent(ctx).resolve();

    // TODO: this should come from config somehow... :/
    const balancesStoredIn = "system";
    const fromAcc = await updateAccountBalance(ctx, from, balancesStoredIn);
    const toAcc = await updateAccountBalance(ctx, to, balancesStoredIn);

    const entities: Array<Account | Extrinsic | Events> = [fromAcc, toAcc];

    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      entities.push(extrinsicEntity, eventEntity);
    }

    await store.save(entities);
  } catch (error) {
    logger.error("Error handling balances Transfer event.", error);
  }
}

export async function balancesWithdrawEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got balances Withdraw event!");
  try {
    const { store, block, event, extrinsic } = ctx;
    const { account } = new NormalisedBalancesWithdrawEvent(ctx).resolve();

    // TODO: this should come from config somehow... :/
    const balancesStoredIn = "system";
    const accountEntity = await updateAccountBalance(
      ctx,
      account,
      balancesStoredIn
    );

    const entities: Array<Account | Extrinsic | Events> = [accountEntity];

    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      entities.push(extrinsicEntity, eventEntity);
    }

    await store.save(entities);
  } catch (error) {
    logger.error("Error handling balances Withdraw event.", error);
  }
}

export async function balancesReservedEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got balances Reserved event!");
  try {
    const { store, block, event, extrinsic } = ctx;
    const { account } = new NormalisedBalancesReservedEvent(ctx).resolve();

    // TODO: this should come from config somehow... :/
    const balancesStoredIn = "system";
    const accountEntity = await updateAccountBalance(
      ctx,
      account,
      balancesStoredIn
    );

    const entities: Array<Account | Extrinsic | Events> = [accountEntity];

    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      entities.push(extrinsicEntity, eventEntity);
    }

    await store.save(entities);
  } catch (error) {
    logger.error("Error handling balances Reserved event.", error);
  }
}

export async function balancesEndowedEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got balances Endowed event!");
  try {
    const { store, block, event, extrinsic } = ctx;
    const { account } = new NormalisedBalancesEndowedEvent(ctx).resolve();
    // TODO: this should come from config somehow... :/
    const balancesStoredIn = "system";
    const accountEntity = await updateAccountBalance(
      ctx,
      account,
      balancesStoredIn
    );

    const entities: Array<Account | Extrinsic | Events> = [accountEntity];

    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      entities.push(extrinsicEntity, eventEntity);
    }

    await store.save(entities);
  } catch (error) {
    logger.error("Error handling balances Endowed event.", error);
  }
}
