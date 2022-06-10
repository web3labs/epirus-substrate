import { ExtrinsicHandlerContext } from "@subsquid/substrate-processor";
import { ContractsCallCall } from "../types/calls";
import * as utils from "./utils";
import { ContractCall, Activity } from "../model";
import { createExtrinsic } from "./utils";

export async function contractsCallExtrinsicHandler(
  ctx: ExtrinsicHandlerContext
): Promise<void> {
  console.log("Got contracts call extrinsic!");
  const ex = new ContractsCallCall(ctx);
  const { store, extrinsic, block } = ctx;
  const { dest } = ex.asV100;
  const contractAddr = utils.getAddressFromMultiAddress(dest);
  const extrinsicEntity = createExtrinsic(extrinsic, block);
  const contractCallEntity = new ContractCall({
    id: extrinsicEntity.id,
    contractAddress: contractAddr,
    createdAt: extrinsicEntity.createdAt,
    extrinsic: extrinsicEntity,
  });

  const activityEntity = new Activity({
    id: contractCallEntity.id,
    type: "ContractCall",
    action: extrinsicEntity.name,
    createdAt: extrinsicEntity.createdAt,
    from: extrinsicEntity.signer,
    to: contractAddr,
    args: extrinsicEntity.args,
  });

  await store.save([extrinsicEntity, contractCallEntity, activityEntity]);
}
