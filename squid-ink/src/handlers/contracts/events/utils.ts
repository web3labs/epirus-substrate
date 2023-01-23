import {
  NormalisedCodeStorageStorage,
  NormalisedOwnerInfoOfStorage,
} from "@chain/normalised-types";
import { SubstrateBlock } from "@subsquid/substrate-processor";
import { getOrCreateAccount, encodeAddress } from "../../utils";
import { Extrinsic, Account, ContractCode } from "../../../model";
import { Ctx } from "../../types";

/**
 * Creates the code owner Account entity and ContractCode entity
 * Used in instantiated, codeUpdated and codeStored handlers
 */
export async function createContractCodeEntities({
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
