import { NormalisedContractsCallCall } from "@chain/normalised-types";
import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import { Ctx, ExtrinsicError, ExtrinsicHandler } from "../types";
import { createActivity, createExtrinsic, getOrCreateAccount } from "../utils";
import { ActivityType, ContractCall } from "../../model";

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
      const accountEntities = [to];
      const from = extrinsicEntity.signer
        ? await getOrCreateAccount(store, extrinsicEntity.signer, block)
        : undefined;
      if (from !== undefined) {
        accountEntities.push(from);
      }

      const activityEntity = createActivity(
        extrinsicEntity,
        ActivityType.CONTRACTCALL,
        to,
        from
      );

      await store.save(accountEntities);
      await store.save(extrinsicEntity);
      await store.save(contractCallEntity);
      await store.save(activityEntity);
    } catch (error) {
      log.error(<Error>error, "Error while handling contract call extrinsic");
    }
  },
};

export { contractsCallHandler };
