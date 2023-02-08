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
import { ActivityType, ContractCode } from "../../model";
import { addDecodedActivityEntities, decodeData } from "./metadata";
import abiDecoder from "../../abi/decoder";

const contractsCallHandler: ExtrinsicHandler = {
  name: "Contracts.call",
  handle: async (
    ctx: Ctx,
    call: SubstrateCall,
    extrinsic: SubstrateExtrinsic,
    block: SubstrateBlock
  ): Promise<void> => {
    const { store, log } = ctx;
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

    // Decode data with ABI
    await decodeData(
      data,
      async (rawData: string | Uint8Array | Buffer) => {
        const codeHash = await getCodeHashForContract(
          ctx,
          block,
          contractAddress
        );

        if (codeHash) {
          const decodedElement = await abiDecoder.decodeMessage({
            codeHash,
            data: rawData,
          });

          addDecodedActivityEntities({
            entities,
            decodedElement,
            activityEntity,
          });
        }
      },
      (errorMessage) =>
        log.error(
          {
            contract: contractAddress,
            block: block.height,
            data,
            error: errorMessage,
          },
          "Error while decoding data at contract call extrinsic."
        )
    );

    await saveAll(store, entities);
  },
};

/**
 * Retrieves the code hash for a certain contract by address
 * First tries to retrieve from on-chain storage but if it fails then tries to retrieve code hash entity linked to contract
 * This fallback mechanism is needed since a contract call could terminate the contract, thus wiping it from on-chain storage
 *
 * @param ctx Processor context
 * @param block Current Substrate block
 * @param contractAddress Address of contract
 * @returns Code hash of the contract or undefined if not found
 */
async function getCodeHashForContract(
  ctx: Ctx,
  block: SubstrateBlock,
  contractAddress: string
) {
  const { store, log } = ctx;
  let resolvedCodeHash;

  try {
    const { codeHash } = await new NormalisedContractInfoOfStorage(
      ctx,
      block
    ).get(contractAddress);
    resolvedCodeHash = toHex(codeHash);
  } catch (error) {
    log.error(
      { error: <Error>error },
      "Error while trying to retrive codeHash in Contracts.Call extrinsic"
    );
    const contractCodeEntity = await store.get(ContractCode, {
      where: {
        contractsDeployed: {
          id: contractAddress,
        },
      },
    });
    if (contractCodeEntity) {
      resolvedCodeHash = contractCodeEntity.id;
    }
  }
  return resolvedCodeHash;
}

export { contractsCallHandler };
