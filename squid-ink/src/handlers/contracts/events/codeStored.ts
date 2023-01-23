import { NormalisedContractsCodeStoredEvent } from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import { ActivityType } from "../../../model";
import {
  createExtrinsic,
  createEvent,
  createActivity,
  saveAll,
} from "../../utils";
import { ContractCodeStoredArgs, Ctx, Event, EventHandler } from "../../types";
import { createContractCodeEntities } from "./utils";

export const contractsCodeStoredHandler: EventHandler = {
  name: "Contracts.CodeStored",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    if (extrinsic && call) {
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const { codeHash } = new NormalisedContractsCodeStoredEvent(
        ctx,
        event
      ).resolve();
      const { codeOwnerEntity, contractCodeEntity } =
        await createContractCodeEntities({
          ctx,
          block,
          codeHash,
          extrinsicEntity,
        });

      const args = (extrinsicEntity.args || {}) as ContractCodeStoredArgs;
      args.codeHash = codeHash;

      const activityEntity = createActivity(
        extrinsicEntity,
        ActivityType.CODESTORED,
        undefined,
        codeOwnerEntity,
        args
      );

      await saveAll(store, [
        extrinsicEntity,
        eventEntity,
        codeOwnerEntity,
        contractCodeEntity,
        activityEntity,
      ]);
    } else {
      log.warn(
        { block: block.height, name: event.name, id: event.id },
        "No extrinsic or call field in event"
      );
      log.debug({ block, event });
    }
  },
};
