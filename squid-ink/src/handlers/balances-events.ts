import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import {
  NormalisedBalancesEndowedEvent,
  NormalisedBalancesReservedEvent,
  NormalisedBalancesTransferEvent,
  NormalisedBalancesWithdrawEvent,
} from "@chain/normalised-types";
import { Account, Events, Extrinsic } from "../model";
import {
  updateAccountBalance,
  createExtrinsic,
  createEvent,
} from "../entity-utils";

export async function balancesTransferEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got balances Transfer event!");
  try {
    const { store, block, event, extrinsic } = ctx;
    const { from, to } = new NormalisedBalancesTransferEvent(ctx).resolve();
    const fromAcc = await updateAccountBalance(ctx, from);
    const toAcc = await updateAccountBalance(ctx, to);
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
    const accountEntity = await updateAccountBalance(ctx, account);
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
    const accountEntity = await updateAccountBalance(ctx, account);
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
    const accountEntity = await updateAccountBalance(ctx, account);
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
