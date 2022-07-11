import { NormalisedContractsCallCall } from "@chain/normalised-types";
import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import { Ctx, ExtrinsicHandler } from "../types";
import { createExtrinsic, getOrCreateAccount } from "../utils";
import { Activity, ActivityType, ContractCall } from "../../model";

const contractsCallHandler: ExtrinsicHandler = {
  name: "Contracts.call",
  handle: async (
    ctx: Ctx,
    call: SubstrateCall,
    extrinsic: SubstrateExtrinsic,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
    log.debug({ block: block.height }, "Got contracts call!");
    try {
      const { contractAddress, value, gasLimit, storageDepositLimit, data } =
        new NormalisedContractsCallCall(ctx, call).resolve();
      const extrinsicEntity = createExtrinsic(extrinsic, call, block, log);
      const contractCallEntity = new ContractCall({
        id: extrinsicEntity.id,
        contractAddress,
        value,
        gasLimit,
        storageDepositLimit,
        data,
        createdAt: extrinsicEntity.createdAt,
        extrinsic: extrinsicEntity,
      });

      const to = await getOrCreateAccount(store, contractAddress);
      const from = extrinsicEntity.signer
        ? await getOrCreateAccount(store, extrinsicEntity.signer)
        : null;

      const activityEntity = new Activity({
        id: contractCallEntity.id,
        type: ActivityType.CONTRACTCALL,
        to,
        action: extrinsicEntity.name,
        createdAt: extrinsicEntity.createdAt,
        from,
        extrinsic: extrinsicEntity,
      });

      await store.save(extrinsicEntity);
      await store.save(contractCallEntity);
      await store.save(activityEntity);
    } catch (error) {
      log.error(<Error>error, "Error while handling contract call extrinsic");
    }
  },
};

export { contractsCallHandler };
