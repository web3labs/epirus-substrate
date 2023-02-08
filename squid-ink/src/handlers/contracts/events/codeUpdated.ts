import { NormalisedContractsCodeUpdatedEvent } from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import abiDecoder from "../../../abi/decoder";
import {
  createExtrinsic,
  createEvent,
  getOrCreateAccount,
  createActivity,
  saveAll,
} from "../../utils";
import { CodeHashChange, ActivityType, Contract } from "../../../model";
import {
  ContractCodeUpdatedArgs,
  Ctx,
  Event,
  EventHandler,
  OptEntity,
} from "../../types";
import { createContractCodeEntities } from "./utils";
import { addDecodedActivityEntities, decodeData } from "../metadata";

export const contractsCodeUpdatedHandler: EventHandler = {
  name: "Contracts.ContractCodeUpdated",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    const { contract, newCodeHash, oldCodeHash } =
      new NormalisedContractsCodeUpdatedEvent(ctx, event).resolve();
    const entities: OptEntity[] = [];

    log.info(
      {
        contract,
        oldCodeHash,
        newCodeHash,
      },
      "Contract code hash has changed"
    );

    const contractEntity = await store.get(Contract, {
      where: { id: contract },
      relations: {
        account: true,
        deployer: true,
        createdFrom: true,
      },
    });

    if (contractEntity === undefined) {
      throw new Error(
        `Contract entity is not found in the database for contract address [${contract}], please make sure that it is created and saved first.`
      );
    }

    if (extrinsic && call) {
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const { codeOwnerEntity, contractCodeEntity } =
        await createContractCodeEntities({
          ctx,
          block,
          codeHash: newCodeHash,
          extrinsicEntity,
        });
      contractEntity.contractCode = contractCodeEntity;

      const codeHashChangeEntity = new CodeHashChange({
        id: event.id,
        contract: contractEntity,
        newCodeHash,
        oldCodeHash,
        changedAt: extrinsicEntity.createdAt,
        extrinsic: extrinsicEntity,
      });

      const signerAccount = extrinsicEntity.signer
        ? await getOrCreateAccount(store, extrinsicEntity.signer, block)
        : undefined;

      const args = (extrinsicEntity.args || {}) as ContractCodeUpdatedArgs;
      args.newCodeHash = newCodeHash;
      args.oldCodeHash = oldCodeHash;

      const activityEntity = createActivity(
        extrinsicEntity,
        ActivityType.CODEUPDATED,
        contractEntity.account,
        signerAccount,
        args
      );
      entities.push(
        codeOwnerEntity,
        signerAccount,
        extrinsicEntity,
        eventEntity,
        contractCodeEntity,
        contractEntity,
        codeHashChangeEntity,
        activityEntity
      );

      const { data } = args;
      // Decode data with ABI
      await decodeData(
        data,
        async (rawData: string | Uint8Array | Buffer) => {
          const decodedElement = await abiDecoder.decodeMessage({
            codeHash: newCodeHash,
            data: rawData,
          });

          addDecodedActivityEntities({
            entities,
            decodedElement,
            activityEntity,
          });
        },
        (errorMessage) =>
          log.error(
            { contract, block: block.height, data, error: errorMessage },
            "Error while decoding data at contract instantiated event."
          )
      );

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
