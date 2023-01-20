import { toHex } from "@subsquid/util-internal-hex";
import { dataToString } from "../utils";
import {
  ContractActionType,
  DecodedArg,
  DecodedContractAction,
} from "../../model";
import abiDecoder from "../../abi-decoder";

type DecodedEntity = DecodedContractAction | DecodedArg;

export async function generateDecodedEntities({
  codeHash,
  actionType,
  data,
}: {
  codeHash: Uint8Array;
  actionType: ContractActionType;
  data: string | Buffer | Uint8Array | BigInt | undefined;
}): Promise<DecodedEntity[]> {
  const ents: DecodedEntity[] = [];

  try {
    if (data) {
      const metadata = await abiDecoder.getMetadata(codeHash);
      if (metadata) {
        const decoded = abiDecoder.decode(metadata, data, actionType);
        const decodedActionEntity = new DecodedContractAction({
          id: `${toHex(codeHash)}-${dataToString(data)}`, // Pretty sure we need extrinsic or event id here to avoid collisons
          name: decoded.name,
          type: actionType,
        });
        ents.push(decodedActionEntity);
        for (const arg of decoded.args) {
          ents.push(
            new DecodedArg({
              id: `${decodedActionEntity.id}-${arg.name}`,
              decodedEvent: decodedActionEntity,
              ...arg,
            })
          );
        }
      }
    }
  } catch (error) {
    console.log(
      `Error at generating decoded entities for codeHash ${toHex(codeHash)}`,
      error
    );
  }

  return ents;
}
