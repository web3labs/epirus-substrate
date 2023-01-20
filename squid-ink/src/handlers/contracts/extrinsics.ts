import {
  NormalisedContractInfoOfStorage,
  NormalisedContractsCallCall,
} from "@chain/normalised-types";
import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import { Ctx, ExtrinsicError, ExtrinsicHandler } from "../types";
import {
  createActivity,
  createExtrinsic,
  getOrCreateAccount,
  saveAll,
} from "../utils";
import { ActivityType, ContractActionType, ContractCall } from "../../model";
import { generateDecodedEntities } from "./metadata";

const contractsCallHandler: ExtrinsicHandler = {
  name: "Contracts.call",
  handle: async (
    ctx: Ctx,
    call: SubstrateCall,
    extrinsic: SubstrateExtrinsic,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store } = ctx;
    const { contractAddress, value, gasLimit, storageDepositLimit, data } =
      new NormalisedContractsCallCall(ctx, call).resolve();
    const extrinsicEntity = createExtrinsic(extrinsic, call, block);
    const contractCallEntity = new ContractCall({
      id: extrinsicEntity.id,
      contractAddress,
      value,
      gasLimit,
      storageDepositLimit,
      data,
      createdAt: extrinsicEntity.createdAt,
      success: extrinsicEntity.success,
      error: <ExtrinsicError>extrinsicEntity.error,
      extrinsic: extrinsicEntity,
    });

    const to = await getOrCreateAccount(store, contractAddress, block);
    const from = extrinsicEntity.signer
      ? await getOrCreateAccount(store, extrinsicEntity.signer, block)
      : undefined;

    const activityEntity = createActivity(
      extrinsicEntity,
      ActivityType.CONTRACTCALL,
      to,
      from
    );

    await saveAll(store, [
      to,
      from,
      extrinsicEntity,
      contractCallEntity,
      activityEntity,
    ]);

    // Decode metadata
    const { codeHash } = await new NormalisedContractInfoOfStorage(
      ctx,
      block
    ).get(contractAddress);

    const decodedEnts = await generateDecodedEntities({
      codeHash,
      data,
      actionType: ContractActionType.MESSAGE,
    });

    await saveAll(store, decodedEnts);
  },
};

export { contractsCallHandler };
