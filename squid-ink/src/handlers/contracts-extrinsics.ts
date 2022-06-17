import { ExtrinsicHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { NormalisedContractsCallCall } from "@chain/normalised-types";
import { Activity, ContractCall } from "../model";
import { createExtrinsic, getOrCreateAccount } from "../entity-utils";

export async function contractsCallExtrinsicHandler(
  ctx: ExtrinsicHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Got contracts call extrinsic!");
  try {
    const { store, extrinsic, block } = ctx;
    const { contractAddress } = new NormalisedContractsCallCall(ctx).resolve();
    const extrinsicEntity = createExtrinsic(extrinsic, block);
    const contractCallEntity = new ContractCall({
      id: extrinsicEntity.id,
      contractAddress,
      createdAt: extrinsicEntity.createdAt,
      extrinsic: extrinsicEntity,
    });

    const activityEntity = new Activity({
      id: contractCallEntity.id,
      type: "ContractCall",
      to: await getOrCreateAccount(store, contractAddress),
      action: extrinsicEntity.name,
      createdAt: extrinsicEntity.createdAt,
      from: await getOrCreateAccount(store, extrinsicEntity.signer),
      args: extrinsicEntity.args,
    });

    await store.save([extrinsicEntity, contractCallEntity, activityEntity]);
  } catch (error) {
    logger.error("Error handling contracts call extrinsics.", error);
  }
}
