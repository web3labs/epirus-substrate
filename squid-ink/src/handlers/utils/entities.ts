import { Logger } from "@subsquid/logger";
import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
  SubstrateExtrinsicSignature,
} from "@subsquid/substrate-processor";
import { Event } from "../types";
import { Extrinsic, Events } from "../../model";

type Args = Record<string, string> | Record<string, Record<string, string>>;

export function createEvent(extrinsicEntity: Extrinsic, event: Event): Events {
  const { id, name, call, indexInBlock } = event;
  return new Events({
    id,
    extrinsic: extrinsicEntity,
    name,
    method: call?.name,
    blockNumber: id.split("-")[0],
    indexInBlock: indexInBlock.toString(),
    createdAt: extrinsicEntity.createdAt,
    params: <Args>extrinsicEntity.args,
  });
}

export function createExtrinsic(
  extrinsic: SubstrateExtrinsic,
  call: SubstrateCall,
  block: SubstrateBlock,
  log: Logger
): Extrinsic {
  const childLog = log.child("entity-creator");
  return new Extrinsic({
    id: extrinsic.id,
    blockNumber: block.height,
    indexInBlock: extrinsic.indexInBlock,
    versionInfo: extrinsic.version,
    name: call.name,
    signer: getSignerAddress(childLog, extrinsic.signature),
    signature: getSignature(childLog, extrinsic.signature),
    success: extrinsic.success,
    fee: extrinsic.fee,
    tip: extrinsic.tip,
    hash: extrinsic.hash,
    createdAt: new Date(block.timestamp),
    args: <Args>call.args,
  });
}

interface Signature {
  __kind: string;
  value: string;
}

function getSignerAddress(
  log: Logger,
  signature?: SubstrateExtrinsicSignature
): string | null {
  if (!signature) {
    return null;
  }
  const address = <Signature>signature.address;
  // TODO: support other address types
  if (address.__kind !== "Id") {
    log.warn({ address }, "Signer address is not of type [Id], returning null");
    return null;
  }
  return address.value;
}

function getSignature(
  log: Logger,
  signature?: SubstrateExtrinsicSignature
): string | null {
  if (!signature) {
    return null;
  }
  const sig = <Signature>signature.signature;
  return sig.value;
}
