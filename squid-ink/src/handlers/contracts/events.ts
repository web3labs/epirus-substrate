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
  Account,
  ActivityType,
  CodeHashChange,
  Contract,
  ContractCode,
  ContractEmittedEvent,
  Extrinsic,
} from "../../model";
import {
  createActivity,
  createEvent,
  createExtrinsic,
  encodeAddress,
  getOrCreateAccount,
} from "../utils";

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
      const deployerAccount = await getOrCreateAccount(store, deployer, block);
      const contractAccount = await getOrCreateAccount(store, contract, block);
      await store.save([deployerAccount, contractAccount]);

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
      if (extrinsic && call) {
        const extrinsicEntity = createExtrinsic(extrinsic, call, block);
        const eventEntity = createEvent(extrinsicEntity, event);

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
        if (allArgs.codeHash !== undefined) {
          allArgs.codeHash = toHex(codeHash);
        }
        const activityEntity = createActivity(
          extrinsicEntity,
          ActivityType.CONTRACT,
          contractAccount,
          deployerAccount,
          allArgs
        );

        await store.save(extrinsicEntity);
        await store.save(eventEntity);
        await store.save(contractEntity);
        await store.save(activityEntity);
      } else {
        log.warn(
          { block: block.height, name: event.name, id: event.id },
          "No extrinsic or call field in event"
        );
        log.debug({ block, event });
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
        const extrinsicEntity = createExtrinsic(extrinsic, call, block);
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
      } else {
        log.warn(
          { block: block.height, name: event.name, id: event.id },
          "No extrinsic or call field in event"
        );
        log.debug({ block, event });
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
        const extrinsicEntity = createExtrinsic(extrinsic, call, block);
        const eventEntity = createEvent(extrinsicEntity, event);
        const { codeHash } = new NormalisedContractsCodeStoredEvent(
          ctx,
          event
        ).resolve();
        const { codeOwnerEntity, contractCodeEntity } =
          await buildContractCodeEntity({
            ctx,
            block,
            codeHash,
            extrinsicEntity,
          });

        await store.save(extrinsicEntity);
        await store.save(eventEntity);
        await store.save(codeOwnerEntity);
        await store.save(contractCodeEntity);
      } else {
        log.warn(
          { block: block.height, name: event.name, id: event.id },
          "No extrinsic or call field in event"
        );
        log.debug({ block, event });
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
      if (contractEntity === undefined) {
        throw new Error(
          `Contract entity is not found in the database for contract address [${contract}], please make sure that it is created and saved first.`
        );
      }
      const contractAccount = await getOrCreateAccount(store, contract, block);
      await store.save(contractAccount);

      if (extrinsic && call) {
        const extrinsicEntity = createExtrinsic(extrinsic, call, block);
        const eventEntity = createEvent(extrinsicEntity, event);
        const { codeOwnerEntity, contractCodeEntity } =
          await buildContractCodeEntity({
            ctx,
            block,
            codeHash: newCodeHash,
            extrinsicEntity,
          });
        await store.save(codeOwnerEntity);
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
        if (signerAccount !== undefined) {
          await store.save(signerAccount);
        }

        const args: ContractCodeUpdatedArgs = extrinsicEntity.args
          ? <ContractCodeUpdatedArgs>extrinsicEntity.args
          : {};
        args.newCodeHash = newCodeHash;
        args.oldCodeHash = oldCodeHash;

        const activityEntity = createActivity(
          extrinsicEntity,
          ActivityType.CODEUPDATED,
          contractAccount,
          signerAccount,
          args
        );

        const entities = [
          extrinsicEntity,
          eventEntity,
          contractCodeEntity,
          contractEntity,
          codeHashChangeEntity,
          activityEntity,
        ];
        for (const entity of entities) {
          await store.save(entity);
        }
      } else {
        log.warn(
          { block: block.height, name: event.name, id: event.id },
          "No extrinsic or call field in event"
        );
        log.debug({ block, event });
      }
    } catch (error) {
      log.error(
        <Error>error,
        "Error handling contracts ContractEmitted event."
      );
    }
  },
};

async function buildContractCodeEntity({
  ctx,
  block,
  codeHash,
  extrinsicEntity,
}: {
  ctx: Ctx;
  block: SubstrateBlock;
  codeHash: string;
  extrinsicEntity: Extrinsic;
}): Promise<{ codeOwnerEntity: Account; contractCodeEntity: ContractCode }> {
  const { code } = await new NormalisedCodeStorageStorage(ctx, block).get(
    codeHash
  );
  const { owner } = await new NormalisedOwnerInfoOfStorage(ctx, block).get(
    codeHash
  );

  const codeOwnerEntity = await getOrCreateAccount(
    ctx.store,
    encodeAddress(owner),
    block
  );

  const contractCodeEntity = new ContractCode({
    id: codeHash,
    code,
    owner: codeOwnerEntity,
    createdFrom: extrinsicEntity,
    createdAt: extrinsicEntity.createdAt,
  });

  return { codeOwnerEntity, contractCodeEntity };
}

export {
  contractsInstantiatedHandler,
  contractsEmittedHandler,
  contractsCodeUpdatedHandler,
  contractsCodeStoredHandler,
};
