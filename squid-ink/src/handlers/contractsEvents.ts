import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { Contract, ContractCode } from "../model";
import { getOrCreateAccount } from "../entities/retrievers";
import { createExtrinsic, createEvent, createActivity } from "../entities";
import {
  NormalisedCodeStorageStorage,
  NormalisedContractInfoOfStorage,
  NormalisedContractsCodeStoredEvent,
  NormalisedContractsInstantiatedEvent,
  NormalisedOwnerInfoOfStorage,
} from "../normalised-types";

export async function contractsInstantiatedEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got contracts instantiated event!");
  const { deployer, contract } = new NormalisedContractsInstantiatedEvent(
    ctx
  ).resolve();
  const { store, extrinsic, block, event } = ctx;

  if (extrinsic) {
    const extrinsicEntity = createExtrinsic(extrinsic, block);
    const eventEntity = createEvent(extrinsicEntity, event);

    const deployerAccount = await getOrCreateAccount(store, deployer);
    const contractAccount = await getOrCreateAccount(store, contract);

    try {
      const { codeHash, trieId, storageDeposit } =
        await new NormalisedContractInfoOfStorage(ctx).get(contract);
      const contractCodeEntity = await ctx.store.get(ContractCode, {
        where: { id: toHex(codeHash) },
      });

      if (contractCodeEntity == null) {
        throw new Error(
          `ContractCode entity is not found in the database for contract address [${contract}], please make sure that it is created and saved first.`
        );
      }

      const contractEntity = new Contract({
        id: contract,
        trieId,
        account: contractAccount,
        deployer: deployerAccount,
        createdAt: extrinsicEntity.createdAt,
        createdFrom: extrinsicEntity,
        contractCode: contractCodeEntity,
        storageDeposit,
      });

      const entities = [
        deployerAccount,
        contractAccount,
        extrinsicEntity,
        eventEntity,
        contractEntity,
        createActivity(
          contractEntity.id,
          "Contract",
          extrinsicEntity,
          contract
        ),
      ];
      await store.save(entities);
    } catch (error) {
      logger.error("Error handling contracts instantiated event.", error);
    }
  }
}

export async function contractsCodeStoredEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got contracts code stored event!");
  const { extrinsic, store, block, event } = ctx;
  if (extrinsic) {
    const { codeHash } = new NormalisedContractsCodeStoredEvent(ctx).resolve();
    const extrinsicEntity = createExtrinsic(extrinsic, block);
    const eventEntity = createEvent(extrinsicEntity, event);

    try {
      const storageInfo = await new NormalisedCodeStorageStorage(ctx).get(
        codeHash
      );
      const ownerInfo = await new NormalisedOwnerInfoOfStorage(ctx).get(
        codeHash
      );

      const contractCodeEntity = new ContractCode({
        id: codeHash,
        code: storageInfo?.code,
        // TODO here the account won't be created...
        owner: await getOrCreateAccount(
          store,
          ss58.codec("substrate").encode(ownerInfo.owner)
        ),
        createdFrom: extrinsicEntity,
        createdAt: extrinsicEntity.createdAt,
      });

      await store.save([extrinsicEntity, eventEntity, contractCodeEntity]);
    } catch (error) {
      logger.error("Error handling code stored event.", error);
    }
  }
}
