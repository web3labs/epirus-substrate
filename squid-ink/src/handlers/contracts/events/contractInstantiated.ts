import {
  NormalisedContractsInstantiatedEvent,
  NormalisedContractInfoOfStorage,
} from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import { toHex } from "@subsquid/util-internal-hex";
import abiDecoder from "../../../abi/decoder";
import {
  getOrCreateAccount,
  createExtrinsic,
  createEvent,
  createActivity,
  saveAll,
} from "../../utils";
import {
  ContractCode,
  StorageInfo,
  Contract,
  ActivityType,
} from "../../../model";
import {
  Ctx,
  ContractInstantiatedArgs,
  Event,
  EventHandler,
  ExtrinsicArg,
  OptEntity,
} from "../../types";
import { addDecodedActivityEntities, decodeData } from "../metadata";
import { createContractCodeEntities } from "./utils";

export const contractsInstantiatedHandler: EventHandler = {
  name: "Contracts.Instantiated",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;

    if (extrinsic && call) {
      const entities: OptEntity[] = [];
      const { deployer, contract } = new NormalisedContractsInstantiatedEvent(
        ctx,
        event
      ).resolve();
      const deployerAccount = await getOrCreateAccount(store, deployer, block);
      const contractAccount = await getOrCreateAccount(store, contract, block);
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);

      const contractInfo = await new NormalisedContractInfoOfStorage(
        ctx,
        block
      ).get(contract);
      const { codeHash, trieId, storageDeposit } = contractInfo;

      let contractCodeEntity = await ctx.store.get(
        ContractCode,
        toHex(codeHash)
      );

      if (contractCodeEntity == null) {
        const ents = await createContractCodeEntities({
          ctx,
          block,
          codeHash: toHex(codeHash),
          extrinsicEntity,
        });
        entities.push(ents.codeOwnerEntity, ents.contractCodeEntity);
        contractCodeEntity = ents.contractCodeEntity;
      }

      const eventEntity = createEvent(extrinsicEntity, event);

      const args = extrinsicEntity.args
        ? <ContractInstantiatedArgs>extrinsicEntity.args
        : null;

      const storageInfo =
        storageDeposit === undefined
          ? new StorageInfo({
              storageBaseDeposit: contractInfo.storageBaseDeposit,
              storageByteDeposit: contractInfo.storageByteDeposit,
              storageBytes: contractInfo.storageBytes,
              storageItemDeposit: contractInfo.storageItemDeposit,
              storageItems: contractInfo.storageItems,
            })
          : new StorageInfo({ storageBaseDeposit: storageDeposit });

      const contractEntity = new Contract({
        id: contract,
        trieId,
        account: contractAccount,
        deployer: deployerAccount,
        createdAt: extrinsicEntity.createdAt,
        createdFrom: extrinsicEntity,
        contractCode: contractCodeEntity,
        storageInfo,
        salt: args ? args.salt : null,
      });

      const allArgs: ContractInstantiatedArgs = args || {};
      if (allArgs.codeHash === undefined) {
        allArgs.codeHash = toHex(codeHash);
      }
      const activityEntity = createActivity(
        extrinsicEntity,
        ActivityType.CONTRACT,
        contractAccount,
        deployerAccount,
        allArgs
      );
      entities.push(
        deployerAccount,
        contractAccount,
        extrinsicEntity,
        eventEntity,
        contractEntity,
        activityEntity
      );

      const { data } = <ExtrinsicArg>extrinsicEntity.args;

      // Decode data with ABI
      await decodeData(
        data,
        async (rawData: string | Uint8Array | Buffer) => {
          const decodedElement = await abiDecoder.decodeConstructor({
            codeHash: toHex(codeHash),
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
