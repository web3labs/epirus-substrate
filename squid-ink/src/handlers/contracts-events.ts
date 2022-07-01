import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import { EventHandlerContext, Store } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import {
  NormalisedCodeStorageStorage,
  NormalisedContractEmittedEvent,
  NormalisedContractInfoOfStorage,
  NormalisedContractsCodeStoredEvent,
  NormalisedContractsInstantiatedEvent,
  NormalisedOwnerInfoOfStorage,
  NormalisedContractsCodeUpdatedEvent,
} from "@chain/normalised-types";
import {
  Activity,
  ActivityType,
  Args,
  CodeHashChange,
  Contract,
  ContractCode,
  Extrinsic,
} from "../model";
import {
  getOrCreateAccount,
  createExtrinsic,
  createEvent,
} from "../entity-utils";
import { ContractEmittedEvent } from "../model/generated/contractEmittedEvent.model";
import { ss58Format } from "../chain-config";

export async function contractsInstantiatedEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got contracts instantiated event!");
  try {
    const { store, extrinsic, block, event } = ctx;

    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const { deployer, contract } = new NormalisedContractsInstantiatedEvent(
        ctx
      ).resolve();
      const deployerAccount = await getOrCreateAccount(store, deployer);
      const contractAccount = await getOrCreateAccount(store, contract);

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

      const saltArg = extrinsicEntity.args?.filter((a) => a.name === "salt");

      const contractEntity = new Contract({
        id: contract,
        trieId,
        account: contractAccount,
        deployer: deployerAccount,
        createdAt: extrinsicEntity.createdAt,
        createdFrom: extrinsicEntity,
        contractCode: contractCodeEntity,
        storageDeposit,
        salt: saltArg && saltArg.length ? saltArg[0].value : undefined,
      });

      const allArgs = extrinsicEntity.args || new Array<Args>();
      allArgs.push(
        new Args({
          name: "codeHash",
          type: "String",
          value: toHex(codeHash),
        })
      );
      const activityEntity = new Activity({
        id: contractEntity.id,
        type: ActivityType.CONTRACT,
        to: contractAccount,
        action: extrinsicEntity.name,
        createdAt: extrinsicEntity.createdAt,
        from: deployerAccount,
        args: allArgs,
        extrinsic: extrinsicEntity,
      });

      const entities = [
        deployerAccount,
        contractAccount,
        extrinsicEntity,
        eventEntity,
        contractEntity,
        activityEntity,
      ];
      await store.save(entities);
    }
  } catch (error) {
    logger.error("Error handling contracts Instantiated event.", error);
  }
}

export async function contractsCodeStoredEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got contracts code stored event!");

  try {
    const { extrinsic, store, block, event } = ctx;
    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const { codeHash } = new NormalisedContractsCodeStoredEvent(
        ctx
      ).resolve();
      const contractCodeEntity = await buildContractCodeEntity({
        ctx,
        codeHash,
        extrinsicEntity,
      });

      await store.save([extrinsicEntity, eventEntity, contractCodeEntity]);
    }
  } catch (error) {
    logger.error("Error handling contract CodeStored event.", error);
  }
}

async function buildContractCodeEntity({
  ctx,
  codeHash,
  extrinsicEntity,
}: {
  ctx: EventHandlerContext;
  codeHash: string;
  extrinsicEntity: Extrinsic;
}): Promise<ContractCode> {
  const { code } = await new NormalisedCodeStorageStorage(ctx).get(codeHash);
  const { owner } = await new NormalisedOwnerInfoOfStorage(ctx).get(codeHash);

  const contractCodeEntity = new ContractCode({
    id: codeHash,
    code,
    owner: await getOrCreateAccount(
      ctx.store,
      ss58.codec(ss58Format).encode(owner)
    ),
    createdFrom: extrinsicEntity,
    createdAt: extrinsicEntity.createdAt,
  });
  return contractCodeEntity;
}

export async function contractsContractEmittedEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got contracts ContractEmitted event!");
  try {
    const { extrinsic, store, block, event } = ctx;
    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const { contract, data } = new NormalisedContractEmittedEvent(
        ctx
      ).resolve();
      const contractEventEntity = new ContractEmittedEvent({
        id: eventEntity.id,
        contractAddress: contract,
        data,
        createdAt: extrinsicEntity.createdAt,
        extrinsic: extrinsicEntity,
      });

      await store.save([extrinsicEntity, eventEntity, contractEventEntity]);
    }
  } catch (error) {
    logger.error("Error handling contracts ContractEmitted event.", error);
  }
}

export async function contractsContractCodeUpdatedEventHandler(
  ctx: EventHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got contracts ContractCodeUpdated event!");
  try {
    const { extrinsic, store, block, event } = ctx;
    if (extrinsic) {
      const extrinsicEntity = createExtrinsic(extrinsic, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const { contract, newCodeHash, oldCodeHash } =
        new NormalisedContractsCodeUpdatedEvent(ctx).resolve();
      logger.info(
        "Contract code hash of contract [%s] has changed from [%s] to [%s]",
        contract,
        oldCodeHash,
        newCodeHash
      );
      const contractEntity = await store.findOneOrFail(Contract, contract);
      const contractCodeEntity = await buildContractCodeEntity({
        ctx,
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

      const allArgs = extrinsicEntity.args || new Array<Args>();
      allArgs.push(
        new Args({
          name: "newCodeHash",
          type: "String",
          value: newCodeHash,
        }),
        new Args({
          name: "oldCodeHash",
          type: "String",
          value: oldCodeHash,
        })
      );
      const activityEntity = new Activity({
        id: codeHashChangeEntity.id,
        type: ActivityType.CODEUPDATED,
        to: await getOrCreateAccount(store, contract),
        action: extrinsicEntity.name,
        createdAt: extrinsicEntity.createdAt,
        args: allArgs,
        extrinsic: extrinsicEntity,
      });

      await store.save([
        extrinsicEntity,
        eventEntity,
        contractCodeEntity,
        contractEntity,
        codeHashChangeEntity,
        activityEntity,
      ]);
    }
  } catch (error) {
    logger.error("Error handling contracts ContractEmitted event.", error);
  }
}
