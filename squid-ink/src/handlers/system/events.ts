import { NormalisedSystemNewAccountEvent } from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import { Ctx, EventHandler, Event } from "../types";
import {
  createEvent,
  createExtrinsic,
  saveAll,
  updateAccountBalance,
} from "../utils";

/**
 * Handler for the systems pallet NewAccount event.
 * Triggered every time a new account is created in the chain.
 * We don't update the balance here because the Balance.Endowed event will take care of it.
 * @param param - event handler params that contains the ctx, event and block
 */
const systemNewAccountHandler: EventHandler = {
  name: "System.NewAccount",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;

    const { account } = new NormalisedSystemNewAccountEvent(
      ctx,
      event
    ).resolve();
    const accountEntity = await updateAccountBalance(ctx, account, block);
    await store.save(accountEntity);
    if (extrinsic && call) {
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      await saveAll(store, [extrinsicEntity, eventEntity]);
    } else {
      log.debug(
        { block: block.height, name: event.name, id: event.id },
        "No extrinsic or call field in event"
      );
      log.trace({ block, event });
    }
  },
};

export { systemNewAccountHandler };
