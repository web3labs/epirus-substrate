import { NormalisedSystemNewAccountEvent } from "@chain/normalised-types";
import { EventHandlerParams } from "../types";
import {
  createAccount,
  createEvent,
  createExtrinsic,
} from "../../entity-utils";

/**
 * Handler for the systems pallet NewAccount event.
 * Triggered every time a new account is created in the chain.
 * We don't update the balance here because the Balance.Endowed event will take care of it.
 * @param param - event handler params that contains the ctx, event and block
 */
export async function handleSystemNewAccount<P>({
  ctx,
  event,
  block,
}: EventHandlerParams<P>): Promise<void> {
  const { store, log } = ctx;
  const { extrinsic, call } = event;
  log.debug({ block: block.height }, "Got system NewAccount event!");
  try {
    if (extrinsic && call) {
      const extrinsicEntity = createExtrinsic(extrinsic, call, block, log);
      const eventEntity = createEvent(extrinsicEntity, event);
      const { account } = new NormalisedSystemNewAccountEvent(
        ctx,
        event
      ).resolve();
      const accountEntity = createAccount(account, new Date(block.timestamp));

      await store.save(accountEntity);
      await store.save(extrinsicEntity);
      await store.save(eventEntity);
    }
  } catch (error) {
    log.error(<Error>error, "Error handling system NewAccount event.");
  }
}
