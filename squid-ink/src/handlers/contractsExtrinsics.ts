import { ExtrinsicHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { ContractCall } from "../model";
import { createActivity, createExtrinsic } from "../entities";
import { NormalisedContractsCallCall } from "../normalised-types";

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

    const activityEntity = createActivity(
      contractCallEntity.id,
      "ContractCall",
      extrinsicEntity,
      contractAddress
    );

    await store.save([extrinsicEntity, contractCallEntity, activityEntity]);
  } catch (error) {
    logger.error("Error handling contracts call extrinsics.", error);
  }
}
