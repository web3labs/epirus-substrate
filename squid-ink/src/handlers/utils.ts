import * as ss58 from "@subsquid/ss58";
import {
  EventParam,
  ExtrinsicArg,
  SubstrateBlock,
  SubstrateEvent,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import { encodeAddress } from "@polkadot/keyring";
import { MultiAddress } from "../types/v100";
import { Args, Extrinsic, Events } from "../model";

export function uintArrayToString(
  input: Uint8Array | Uint16Array | Uint32Array
): string {
  return `0x${Buffer.from(input).toString("hex")}`;
}

export function getAddressOf(addr: Uint8Array): string {
  return ss58.codec("substrate").encode(addr);
}

export function getAddressFromMultiAddress(addr: MultiAddress): string {
  // TODO: handle index and raw type of multi-address :O
  return encodeAddress(addr.value as Uint8Array);
}

export function createEvent(
  extrinsicEntity: Extrinsic,
  event: SubstrateEvent
): Events {
  const { id, name, method, blockNumber, indexInBlock, params } = event;
  return new Events({
    id,
    extrinsic: extrinsicEntity,
    name,
    method,
    blockNumber: blockNumber.toString(),
    indexInBlock: indexInBlock.toString(),
    createdAt: extrinsicEntity.createdAt,
    params: castArgsToArgsType(params),
  });
}

export function createExtrinsic(
  ext: SubstrateExtrinsic,
  block: SubstrateBlock
): Extrinsic {
  const {
    id,
    indexInBlock,
    hash,
    name,
    method,
    signer,
    signature,
    args,
    tip,
    section,
    versionInfo,
  } = ext;
  return new Extrinsic({
    id,
    hash,
    name,
    method,
    section,
    signer,
    signature,
    versionInfo,
    tip,
    blockNumber: block.height.toString(),
    blockHash: block.hash.toString(),
    createdAt: new Date(block.timestamp),
    indexInBlock: indexInBlock.toString(),
    args: castArgsToArgsType(args),
  });
}

export function castArgsToArgsType(
  args: ExtrinsicArg[] | EventParam[]
): Args[] {
  const converted: Args[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const { type, name, value } = args[i];
    let valueAsString = null;
    switch (typeof value) {
      case "string":
        valueAsString = value;
        break;
      case "number":
        valueAsString = value.toString();
        break;
      case "object":
        valueAsString = JSON.stringify(value);
        break;
      case "boolean":
        valueAsString = String(value);
        break;
      default:
        valueAsString = "unknown";
    }
    converted.push(
      new Args({
        type,
        name,
        value: valueAsString,
      })
    );
  }
  return converted;
}
