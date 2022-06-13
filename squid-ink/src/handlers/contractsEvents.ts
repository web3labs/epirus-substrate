import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import { EventHandlerContext } from "@subsquid/substrate-processor";
import { Contract, ContractCode } from "../model";
import { getOrCreateAccount } from "../entities/retrievers";
import { createExtrinsic, createEvent, createActivity } from "../entities";
import {
  EnhancedCodeStorageStorage,
  EnhancedContractInfoOfStorage,
  EnhancedContractsCodeStoredEvent,
  EnhancedContractsInstantiatedEvent,
  EnhancedOwnerInfoOfStorage,
} from "../enhanced-types";

export async function contractsInstantiatedEventHandler(
  ctx: EventHandlerContext
): Promise<void> {
  console.log("Got contracts instantiated event!");
  const { deployer, contract } = new EnhancedContractsInstantiatedEvent(
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
        await new EnhancedContractInfoOfStorage(ctx).get(contract);
      const contractCodeEntity = await ctx.store.get(ContractCode, {
        where: { id: toHex(codeHash) },
      });

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
      console.log(error);
    }
  }
}

export async function contractsCodeStoredEventHandler(
  ctx: EventHandlerContext
): Promise<void> {
  const { codeHash } = new EnhancedContractsCodeStoredEvent(ctx).resolve();
  const { extrinsic, store, block, event } = ctx;
  if (extrinsic) {
    const extrinsicEntity = createExtrinsic(extrinsic, block);
    const eventEntity = createEvent(extrinsicEntity, event);
    // Get code info
    const storageInfo = await new EnhancedCodeStorageStorage(ctx).get(codeHash);

    // Get owner info
    const ownerInfo = await new EnhancedOwnerInfoOfStorage(ctx).get(codeHash);

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
  }
}
