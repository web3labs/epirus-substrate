import {
  NormalisedBalancesEndowedEvent,
  NormalisedBalancesReservedEvent,
  NormalisedBalancesTransferEvent,
  NormalisedBalancesWithdrawEvent,
} from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import { Ctx, Event, EventHandler, EventHandlerParams } from "../types";
import { createEvent, createExtrinsic, updateAccountBalance } from "../utils";

const balancesTransferHandler: EventHandler = {
  name: "Balances.Transfer",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
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
  },
};

const balancesWithdrawHandler: EventHandler = {
  name: "Balances.Withdraw",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
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
  },
};

const balancesReservedHandler: EventHandler = {
  name: "Balances.Reserved",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
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
  },
};

const balancesEndowedHandler: EventHandler = {
  name: "Balances.Endowed",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
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
  },
};

async function updateEntities({
  ctx,
  event,
  block,
  accounts,
}: EventHandlerParams & { accounts: string[] }): Promise<void> {
  const { store, log } = ctx;
  const { extrinsic, call } = event;
  for (const account of accounts) {
    const accountEntity = await updateAccountBalance(ctx, account, block);
    await store.save(accountEntity);
  }
  if (extrinsic && call) {
    const extrinsicEntity = createExtrinsic(extrinsic, call, block);
    const eventEntity = createEvent(extrinsicEntity, event);
    await store.save(extrinsicEntity);
    await store.save(eventEntity);
  } else {
    log.debug(
      { block: block.height, name: event.name, id: event.id },
      "No extrinsic or call field in event"
    );
    log.trace({ block, event });
  }
}

export {
  balancesTransferHandler,
  balancesWithdrawHandler,
  balancesReservedHandler,
  balancesEndowedHandler,
};
