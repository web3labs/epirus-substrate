import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { Account, Balance, Events, Extrinsic } from "../model";
import { updateAccount, createExtrinsic, createEvent } from "../entities";
import {
  NormalisedBalancesAccountStorage,
  NormalisedBalancesEndowedEvent,
  NormalisedBalancesReservedEvent,
  NormalisedBalancesTransferEvent,
  NormalisedBalancesWithdrawEvent,
  NormalisedSystemAccountStorage,
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
    const fromBalances = await getBalances(ctx, from, balancesStoredIn);
    const toBalances = await getBalances(ctx, to, balancesStoredIn);

    const fromAcc = await updateAccount(ctx.store, from, fromBalances);
    const toAcc = await updateAccount(ctx.store, to, toBalances);

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
    const balances = await getBalances(ctx, account, balancesStoredIn);
    const accountEntity = await updateAccount(ctx.store, account, balances);

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
    const balances = await getBalances(ctx, account, balancesStoredIn);
    const accountEntity = await updateAccount(ctx.store, account, balances);

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
    const { account, freeBalance } = new NormalisedBalancesEndowedEvent(
      ctx
    ).resolve();
    const accountEntity = await updateAccount(
      ctx.store,
      account,
      new Balance({ free: freeBalance })
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

async function getBalances(
  ctx: EventHandlerContext,
  address: string,
  storageType: string
): Promise<Balance> {
  if (storageType === "system") {
    const accountStorage = await new NormalisedSystemAccountStorage(ctx).get(
      address
    );
    const { free, reserved, miscFrozen, feeFrozen } = accountStorage.data;
    return new Balance({ free, reserved, miscFrozen, feeFrozen });
  }
  if (storageType === "balances") {
    const { free, reserved, miscFrozen, feeFrozen } =
      await new NormalisedBalancesAccountStorage(ctx).get(address);
    return new Balance({ free, reserved, miscFrozen, feeFrozen });
  }
  throw new Error(`Type of balances storage [${storageType}] not supported!`);
}
