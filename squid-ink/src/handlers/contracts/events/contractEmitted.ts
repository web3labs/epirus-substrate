import {
  NormalisedContractEmittedEvent,
  NormalisedContractInfoOfStorage,
} from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import { ContractEvent } from "../../../model";
import { createExtrinsic, createEvent, saveAll } from "../../utils";
import abiDecoder from "../../../abi/abi-decoder";
import { Ctx, Event, EventHandler } from "../../types";
import { addDecodedEventEntities } from "../metadata";

export const contractsEmittedHandler: EventHandler = {
  name: "Contracts.ContractEmitted",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    if (extrinsic && call) {
      const entities = [];
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const { contract, data } = new NormalisedContractEmittedEvent(
        ctx,
        event
      ).resolve();
      const contractEventEntity = new ContractEvent({
        id: eventEntity.id,
        blockNumber: eventEntity.blockNumber,
        indexInBlock: eventEntity.indexInBlock,
        contractAddress: contract,
        data,
        createdAt: extrinsicEntity.createdAt,
        extrinsic: extrinsicEntity,
      });

      entities.push(extrinsicEntity, eventEntity, contractEventEntity);

      // TODO: Toggle decode
      const { codeHash } = await new NormalisedContractInfoOfStorage(
        ctx,
        block
      ).get(contract);

      const decodedElement = await abiDecoder.decodeEvent({
        codeHash,
        data,
      });

      addDecodedEventEntities({
        entities,
        decodedElement,
        contractEventEntity,
      });

      await saveAll(store, entities);
    } else {
      log.warn(
        { block: block.height, name: event.name, id: event.id },
        "No extrinsic or call field in event"
      );
      log.debug({ block, event });
    }
  },
};
