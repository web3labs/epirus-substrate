import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { NormalisedSystemNewAccountEvent } from "@chain/normalised-types";
import { createAccount, createEvent, createExtrinsic } from "../entity-utils";
import { Account } from "../model";

/**
 * Handler for the systems pallet NewAccount event.
 * Triggered every time a new account is created in the chain.
 * @param ctx - an event handler context
 * @param logger - a winston logger
 */
export async function systemNewAccountEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got system NewAccount event!");
  try {
    const { extrinsic, store, block, event } = ctx;
    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const { account } = new NormalisedSystemNewAccountEvent(ctx).resolve();
      const accountEntity = createAccount(
        account,
        new Date(ctx.block.timestamp)
      );
      const entities = [
        extrinsicEntity,
        createEvent(extrinsicEntity, event),
        accountEntity,
      ];
      await store.save(entities);
    }
  } catch (error) {
    logger.error("Error handling system NewAccount event.", error);
  }
}
