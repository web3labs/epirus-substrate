import * as ss58 from "@subsquid/ss58";
import {
  NormalisedCodeStorageStorage,
  NormalisedContractEmittedEvent,
  NormalisedContractInfoOfStorage,
  NormalisedContractsCodeStoredEvent,
  NormalisedContractsCodeUpdatedEvent,
  NormalisedContractsInstantiatedEvent,
  NormalisedOwnerInfoOfStorage,
} from "@chain/normalised-types";
import { toHex } from "@subsquid/util-internal-hex";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import {
  ContractCodeUpdatedArgs,
  ContractInstantiatedArgs,
  Ctx,
  Event,
  EventHandler,
} from "../types";
import {
  Activity,
  ActivityType,
  CodeHashChange,
  Contract,
  ContractCode,
  ContractEmittedEvent,
  Extrinsic,
} from "../../model";
import { createEvent, createExtrinsic, getOrCreateAccount } from "../utils";
import { ss58Format } from "../../chain-config";

const contractsInstantiatedHandler: EventHandler = {
  name: "Contracts.Instantiated",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    try {
      log.debug({ block: block.height }, "Got contracts instantiated event!");
      const { deployer, contract } = new NormalisedContractsInstantiatedEvent(
        ctx,
        event
      ).resolve();
      const deployerAccount = await getOrCreateAccount(store, deployer);
      const contractAccount = await getOrCreateAccount(store, contract);

      if (extrinsic && call) {
        const extrinsicEntity = createExtrinsic(extrinsic, call, block, log);
        const eventEntity = createEvent(extrinsicEntity, event);

        const { codeHash, trieId, storageDeposit } =
          await new NormalisedContractInfoOfStorage(ctx, block).get(contract);
        const contractCodeEntity = await ctx.store.get(
          ContractCode,
          toHex(codeHash)
        );

        if (contractCodeEntity == null) {
          throw new Error(
            `ContractCode entity is not found in the database for contract address [${contract}], please make sure that it is created and saved first.`
          );
        }

        const args = extrinsicEntity.args
          ? <ContractInstantiatedArgs>extrinsicEntity.args
          : null;

        const contractEntity = new Contract({
          id: contract,
          trieId,
          account: contractAccount,
          deployer: deployerAccount,
          createdAt: extrinsicEntity.createdAt,
          createdFrom: extrinsicEntity,
          contractCode: contractCodeEntity,
          storageDeposit,
          salt: args ? args.salt : null,
        });

        const allArgs: ContractInstantiatedArgs = args || {};
        if (!allArgs.codeHash) {
          allArgs.codeHash = toHex(codeHash);
        }
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

        await store.save(extrinsicEntity);
        await store.save(eventEntity);
        await store.save(contractEntity);
        await store.save(activityEntity);
      }
    } catch (error) {
      console.log(error);
      log.error(
        <Error>error,
        "Error while handling contracts instantiated event"
      );
    }
  },
};

const contractsEmittedHandler: EventHandler = {
  name: "Contracts.ContractEmitted",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    log.debug({ block: block.height }, "Got contracts emitted event!");
    try {
      if (extrinsic && call) {
        const extrinsicEntity = createExtrinsic(extrinsic, call, block, log);
        const eventEntity = createEvent(extrinsicEntity, event);
        const { contract, data } = new NormalisedContractEmittedEvent(
          ctx,
          event
        ).resolve();
        const contractEventEntity = new ContractEmittedEvent({
          id: eventEntity.id,
          contractAddress: contract,
          data,
          createdAt: extrinsicEntity.createdAt,
          extrinsic: extrinsicEntity,
        });

        await store.save(extrinsicEntity);
        await store.save(eventEntity);
        await store.save(contractEventEntity);
      }
    } catch (error) {
      log.error(
        <Error>error,
        "Error handling contracts ContractEmitted event."
      );
    }
  },
};

const contractsCodeStoredHandler: EventHandler = {
  name: "Contracts.CodeStored",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    log.debug({ block: block.height }, "Got contracts code stored event!");
    try {
      if (extrinsic && call) {
        const extrinsicEntity = createExtrinsic(extrinsic, call, block, log);
        const eventEntity = createEvent(extrinsicEntity, event);
        const { codeHash } = new NormalisedContractsCodeStoredEvent(
          ctx,
          event
        ).resolve();
        const contractCodeEntity = await buildContractCodeEntity({
          ctx,
          block,
          codeHash,
          extrinsicEntity,
        });

        await store.save(extrinsicEntity);
        await store.save(eventEntity);
        await store.save(contractCodeEntity);
      }
    } catch (error) {
      log.error(
        <Error>error,
        "Error while handling contract CodeStored event."
      );
    }
  },
};

const contractsCodeUpdatedHandler: EventHandler = {
  name: "Contracts.ContractCodeUpdated",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    log.debug(
      { block: block.height },
      "Got contracts ContractCodeUpdated event!"
    );
    try {
      if (extrinsic && call) {
        const extrinsicEntity = createExtrinsic(extrinsic, call, block, log);
        const eventEntity = createEvent(extrinsicEntity, event);
        const { contract, newCodeHash, oldCodeHash } =
          new NormalisedContractsCodeUpdatedEvent(ctx, event).resolve();

        log.info(
          {
            contract,
            oldCodeHash,
            newCodeHash,
          },
          "Contract code hash has changed"
        );

        const contractEntity = await store.get(Contract, contract);
        if (contractEntity == null) {
          throw new Error(
            `Contract entity is not found in the database for contract address [${contract}], please make sure that it is created and saved first.`
          );
        }
        const contractCodeEntity = await buildContractCodeEntity({
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

        const args = extrinsicEntity.args
          ? <ContractCodeUpdatedArgs>extrinsicEntity.args
          : null;
        const allArgs: ContractCodeUpdatedArgs = args || {};
        allArgs.newCodeHash = newCodeHash;
        allArgs.oldCodeHash = oldCodeHash;

        const activityEntity = new Activity({
          id: codeHashChangeEntity.id,
          type: ActivityType.CODEUPDATED,
          from: extrinsicEntity.signer
            ? await getOrCreateAccount(store, extrinsicEntity.signer)
            : null,
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
      log.error(
        <Error>error,
        "Error handling contracts ContractEmitted event."
      );
    }
  },
};

async function buildContractCodeEntity<P>({
  ctx,
  block,
  codeHash,
  extrinsicEntity,
}: {
  ctx: Ctx;
  block: SubstrateBlock;
  codeHash: string;
  extrinsicEntity: Extrinsic;
}): Promise<ContractCode> {
  const { code } = await new NormalisedCodeStorageStorage(ctx, block).get(
    codeHash
  );
  const { owner } = await new NormalisedOwnerInfoOfStorage(ctx, block).get(
    codeHash
  );

  const ownerEntity = await getOrCreateAccount(
    ctx.store,
    ss58.codec(ss58Format).encode(owner)
  );

  const contractCodeEntity = new ContractCode({
    id: codeHash,
    code,
    owner: ownerEntity,
    createdFrom: extrinsicEntity,
    createdAt: extrinsicEntity.createdAt,
  });
  return contractCodeEntity;
}

export {
  contractsInstantiatedHandler,
  contractsEmittedHandler,
  contractsCodeUpdatedHandler,
  contractsCodeStoredHandler,
};
