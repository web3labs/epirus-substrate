import { ExtrinsicHandlerContext } from "@subsquid/substrate-processor";
import { ContractCall } from "../model";
import { createActivity, createExtrinsic } from "../entities";
import { EnhancedContractsCallCall } from "../enhanced-types";

export async function contractsCallExtrinsicHandler(
  ctx: ExtrinsicHandlerContext
): Promise<void> {
  console.log("Got contracts call extrinsic!");
  const { store, extrinsic, block } = ctx;
  const { contractAddress } = new EnhancedContractsCallCall(ctx).resolve();
  const extrinsicEntity = createExtrinsic(extrinsic, block);
  const contractCallEntity = new ContractCall({
    id: extrinsicEntity.id,
    contractAddress,
    createdAt: extrinsicEntity.createdAt,
    extrinsic: extrinsicEntity,
  });

  const activityEntity = createActivity(
    contractCallEntity.id,
    "ContractCall",
    extrinsicEntity,
    contractAddress
  );

  await store.save([extrinsicEntity, contractCallEntity, activityEntity]);
}
