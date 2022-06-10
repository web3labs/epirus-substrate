import * as ss58 from "@subsquid/ss58";
import {
  EventHandlerContext,
} from "@subsquid/substrate-processor";
import { Activity, Contract, ContractCode } from "../model";
import { ContractsCodeStoredEvent, ContractsInstantiatedEvent } from "../types/events";
import { 
  ContractsCodeStorageStorage,
  ContractsContractInfoOfStorage,
  ContractsOwnerInfoOfStorage
} from "../types/storage";
import { getOrCreateAccount } from "./storeUtils"
import { createExtrinsic, uintArrayToString } from "./utils";

export async function contractsInstantiatedEventHandler(ctx: EventHandlerContext): Promise<void> {
  console.log("Got contracts initiated event!");
  const event = new ContractsInstantiatedEvent(ctx);
  const { deployer, contract } = event.asV100;
  const { store, extrinsic, block } = ctx;

  if (extrinsic) {
    const extrinsicEntity = createExtrinsic(extrinsic, block);
    // Store deployer and contract accounts
    const deployerAddress = ss58.codec("substrate").encode(deployer);
    const contractAddress = ss58.codec("substrate").encode(contract);
    const deployerAccount = await getOrCreateAccount(store, deployerAddress);
    const contractAccount = await getOrCreateAccount(store, contractAddress);

    // Get code hash of contract
    const codeHashStorage = new ContractsContractInfoOfStorage(ctx);
    const contractInfo = await codeHashStorage.getAsV100(contract);
    if (contractInfo) {
      const contractCodeEntity = await ctx.store.get(ContractCode, {
        where: { id: uintArrayToString(contractInfo.codeHash) },
      });

      let contractEntity = new Contract({
        id: contractAddress,
        trieId: contractInfo.trieId,
        account: contractAccount,
        deployer: deployerAccount,
        deployedOn: extrinsicEntity.createdAt,
        createdFrom: extrinsicEntity,
        contractCode: contractCodeEntity
      });
    
      const entities = [
        deployerAccount,
        contractAccount,
        extrinsicEntity,
        contractEntity,
        new Activity({
          id: contractEntity.id,
          type: "Contract",
          action: extrinsicEntity.name,
          to: contractAddress,
          createdAt: extrinsicEntity.createdAt,
          from: extrinsicEntity.signer,
          args: extrinsicEntity.args
        }),
      ]
      await store.save(entities);
    } else {
      // TODO: handle no contract info !! :_(
    }
  }
}

export async function contractsCodeStoredEventHandler(ctx: EventHandlerContext): Promise<void> {
  const event = new ContractsCodeStoredEvent(ctx);
  const { codeHash } = event.asV100;
  const { extrinsic, store, block } = ctx;
  if (extrinsic) {
    // Get code info
    const codeStorage = new ContractsCodeStorageStorage(ctx);
    const storageInfo = await codeStorage.getAsV100(codeHash);

    // Get owner info
    const ownerStorage = new ContractsOwnerInfoOfStorage(ctx);
    const ownerInfo = await ownerStorage.getAsV100(codeHash);
  
    const extrinsicEntity = createExtrinsic(extrinsic, block);

    const contractCodeEntity = new ContractCode({
      id: uintArrayToString(codeHash),
      code: storageInfo?.code,
      // TODO here the account won't be created...
      owner: ownerInfo && await getOrCreateAccount(store, ss58.codec("substrate").encode(ownerInfo.owner)),
      createdFrom: extrinsicEntity
    });

    const activityEntity = new Activity({
      id: contractCodeEntity.id,
      type: "ContractCode",
      action: extrinsicEntity.name,
      createdAt: extrinsicEntity.createdAt,
      from: extrinsicEntity.signer,
      args: extrinsicEntity.args
    });

    await store.save([
      extrinsicEntity,
      contractCodeEntity,
      activityEntity
    ]);
  }
}

