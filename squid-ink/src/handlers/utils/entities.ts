import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
  SubstrateExtrinsicSignature,
} from "@subsquid/substrate-processor";
import {
  ContractCodeUpdatedArgs,
  ContractInstantiatedArgs,
  Event,
} from "../types";
import {
  Extrinsic,
  Events,
  Activity,
  Account,
  ActivityType,
} from "../../model";

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
  block: SubstrateBlock
): Extrinsic {
  const { signature } = extrinsic;
  return new Extrinsic({
    id: extrinsic.id,
    blockNumber: block.height,
    indexInBlock: extrinsic.indexInBlock,
    versionInfo: extrinsic.version,
    name: call.name,
    signer: signature ? getSignerAddress(signature) : null,
    signature: signature ? getSignature(signature) : null,
    success: extrinsic.success,
    fee: extrinsic.fee,
    tip: extrinsic.tip,
    hash: extrinsic.hash,
    createdAt: new Date(block.timestamp),
    args: <Args>call.args,
  });
}

export function createActivity(
  extrinsicEntity: Extrinsic,
  type: ActivityType,
  to: Account,
  from?: Account,
  args?: ContractCodeUpdatedArgs | ContractInstantiatedArgs
): Activity {
  return new Activity({
    id: `${extrinsicEntity.id}-${type}`,
    type,
    to,
    action: extrinsicEntity.name,
    createdAt: extrinsicEntity.createdAt,
    from,
    extrinsic: extrinsicEntity,
    args: args || extrinsicEntity.args,
  });
}

interface Signature {
  __kind: string;
  value: string;
}

function getSignerAddress(signature: SubstrateExtrinsicSignature): string {
  const { value } = <Signature>signature.address;
  return value;
}

function getSignature(signature: SubstrateExtrinsicSignature): string {
  const { value } = <Signature>signature.signature;
  return value;
}
