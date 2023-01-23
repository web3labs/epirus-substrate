import { NormalisedContractsCodeRemovedEvent } from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import { createExtrinsic, createEvent, saveAll } from "../../utils";
import { ContractCode } from "../../../model";
import { Ctx, Event, EventHandler } from "../../types";

export const contractsCodeRemovedHandler: EventHandler = {
  name: "Contracts.CodeRemoved",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    const { codeHash } = new NormalisedContractsCodeRemovedEvent(
      ctx,
      event
    ).resolve();

    log.info({ codeHash }, "Contract code hash has been removed");

    const contractCodeEntity = await store.get(ContractCode, {
      where: { id: codeHash },
      relations: {
        owner: true,
        createdFrom: true,
      },
    });

    if (contractCodeEntity === undefined) {
      throw new Error(
        `Contract code entity is not found in the database for code hash [${codeHash}]`
      );
    }

    if (extrinsic && call) {
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      contractCodeEntity.removedAt = new Date(block.timestamp);
      contractCodeEntity.removedFrom = extrinsicEntity;
      await saveAll(store, [extrinsicEntity, eventEntity, contractCodeEntity]);
    } else {
      log.warn(
        {
          block: block.height,
          name: event.name,
          id: event.id,
          contractCode: codeHash,
        },
        "No extrinsic or call field in event. Code removed info not updated for contract code."
      );
      log.debug({ block, event });
    }
  },
};
