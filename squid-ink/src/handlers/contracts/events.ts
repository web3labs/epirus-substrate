import {
  NormalisedCodeStorageStorage,
  NormalisedContractEmittedEvent,
  NormalisedContractInfoOfStorage,
  NormalisedContractsCodeRemovedEvent,
  NormalisedContractsCodeStoredEvent,
  NormalisedContractsCodeUpdatedEvent,
  NormalisedContractsInstantiatedEvent,
  NormalisedContractTerminatedEvent,
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
  saveAll,
  updateAccountBalance,
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

    if (extrinsic && call) {
      const { deployer, contract } = new NormalisedContractsInstantiatedEvent(
        ctx,
        event
      ).resolve();
      const deployerAccount = await getOrCreateAccount(store, deployer, block);
      const contractAccount = await getOrCreateAccount(store, contract, block);
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);

      const { codeHash, trieId, storageDeposit } =
        await new NormalisedContractInfoOfStorage(ctx, block).get(contract);

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
        await saveAll(store, [ents.codeOwnerEntity, ents.contractCodeEntity]);
        contractCodeEntity = ents.contractCodeEntity;
      }

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

      await saveAll(store, [
        deployerAccount,
        contractAccount,
        extrinsicEntity,
        eventEntity,
        contractEntity,
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

const contractsEmittedHandler: EventHandler = {
  name: "Contracts.ContractEmitted",
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
      const { contract, data } = new NormalisedContractEmittedEvent(
        ctx,
        event
      ).resolve();
      const contractEventEntity = new ContractEmittedEvent({
        id: eventEntity.id,
        blockNumber: eventEntity.blockNumber,
        indexInBlock: eventEntity.indexInBlock,
        contractAddress: contract,
        data,
        createdAt: extrinsicEntity.createdAt,
        extrinsic: extrinsicEntity,
      });

      await saveAll(store, [extrinsicEntity, eventEntity, contractEventEntity]);
    } else {
      log.warn(
        { block: block.height, name: event.name, id: event.id },
        "No extrinsic or call field in event"
      );
      log.debug({ block, event });
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

      await saveAll(store, [
        extrinsicEntity,
        eventEntity,
        codeOwnerEntity,
        contractCodeEntity,
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

const contractsCodeUpdatedHandler: EventHandler = {
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

      await saveAll(store, [
        codeOwnerEntity,
        signerAccount,
        extrinsicEntity,
        eventEntity,
        contractCodeEntity,
        contractEntity,
        codeHashChangeEntity,
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

const contractsCodeRemovedHandler: EventHandler = {
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

const contractsTerminatedHandler: EventHandler = {
  name: "Contracts.Terminated",
  handle: async (
    ctx: Ctx,
    event: Event,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    const { extrinsic, call } = event;
    const { contract, beneficiary } = new NormalisedContractTerminatedEvent(
      ctx,
      event
    ).resolve();

    log.info({ contract, beneficiary }, "Contract has been terminated");

    const contractEntity = await store.get(Contract, {
      where: { id: contract },
      relations: {
        account: true,
        deployer: true,
        createdFrom: true,
        contractCode: true,
      },
    });
    // Update balances since terminated contract will transfer remaining balance to beneficiary
    const contractAccount = await updateAccountBalance(ctx, contract, block);
    const beneficiaryAccount = await updateAccountBalance(
      ctx,
      beneficiary,
      block
    );

    if (contractEntity === undefined) {
      throw new Error(
        `Contract entity is not found in the database for contract address [${contract}]`
      );
    }

    if (extrinsic && call) {
      const extrinsicEntity = createExtrinsic(extrinsic, call, block);
      const eventEntity = createEvent(extrinsicEntity, event);
      const extrinsicSigner = extrinsicEntity.signer
        ? await getOrCreateAccount(store, extrinsicEntity.signer, block)
        : undefined;
      contractEntity.terminatedAt = new Date(block.timestamp);
      contractEntity.terminatedFrom = extrinsicEntity;
      contractEntity.terminationBeneficiary = beneficiaryAccount;
      const activityEntity = createActivity(
        extrinsicEntity,
        ActivityType.CONTRACTTERMINATE,
        contractAccount,
        extrinsicSigner
      );
      await saveAll(store, [
        contractAccount,
        beneficiaryAccount,
        extrinsicSigner,
        extrinsicEntity,
        eventEntity,
        contractEntity,
        activityEntity,
      ]);
    } else {
      log.warn(
        {
          block: block.height,
          name: event.name,
          id: event.id,
          contract,
          beneficiary,
        },
        "No extrinsic or call field in event. Contract terminated info not updated."
      );
      log.debug({ block, event });
    }
  },
};

async function createContractCodeEntities({
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
  contractsCodeRemovedHandler,
  contractsTerminatedHandler,
};
