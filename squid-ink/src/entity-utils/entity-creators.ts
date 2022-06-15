import {
  EventParam,
  ExtrinsicArg,
  SubstrateBlock,
  SubstrateEvent,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import { Args, Extrinsic, Events } from "../model";

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

function castArgsToArgsType(args: ExtrinsicArg[] | EventParam[]): Args[] {
  const converted: Args[] = [];

  for (let i = 0; i < args.length; i += 1) {
    const { type, name, value } = args[i];
    let valueAsString: string;
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
