import {
  NormalisedContractInfoOfStorage,
  NormalisedContractsCallCall,
} from "@chain/normalised-types";
import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
  toHex,
} from "@subsquid/substrate-processor";
import { Ctx, ExtrinsicHandler, OptEntity } from "../types";
import {
  createActivity,
  createExtrinsic,
  getOrCreateAccount,
  saveAll,
} from "../utils";
import { ActivityType } from "../../model";
import { addDecodedActivityEntities } from "./metadata";
import abiDecoder from "../../abi/decoder";

const contractsCallHandler: ExtrinsicHandler = {
  name: "Contracts.call",
  handle: async (
    ctx: Ctx,
    call: SubstrateCall,
    extrinsic: SubstrateExtrinsic,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store } = ctx;
    const { contractAddress, data } = new NormalisedContractsCallCall(
      ctx,
      call
    ).resolve();
    const entities: OptEntity[] = [];
    const extrinsicEntity = createExtrinsic(extrinsic, call, block);

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

    entities.push(to, from, extrinsicEntity, activityEntity);

    // TODO this can be toggled
    if (data) {
      const { codeHash } = await new NormalisedContractInfoOfStorage(
        ctx,
        block
      ).get(contractAddress);

      const decodedElement = await abiDecoder.decodeMessage({
        codeHash: toHex(codeHash),
        data,
      });

      addDecodedActivityEntities({
        entities,
        decodedElement,
        activityEntity,
      });
    }

    await saveAll(store, entities);
  },
};

export { contractsCallHandler };
