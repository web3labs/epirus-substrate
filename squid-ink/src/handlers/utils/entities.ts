import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
  SubstrateExtrinsicSignature,
} from "@subsquid/substrate-processor";
import { Entity, Store } from "@subsquid/typeorm-store";
import {
  ContractCodeUpdatedArgs,
  ContractInstantiatedArgs,
  Event,
  ExtrinsicError,
} from "../types";
import {
  Extrinsic,
  Events,
  Activity,
  Account,
  ActivityType,
} from "../../model";
import { encodeAddress } from "./accounts";

type Args = Record<string, string> | Record<string, Record<string, string>>;

export async function saveAll<E extends Entity | undefined>(
  store: Store,
  entities: E[]
): Promise<void> {
  for (const entity of entities) {
    if (entity !== undefined) {
      await store.save(entity);
    }
  }
}

export function createEvent(extrinsicEntity: Extrinsic, event: Event): Events {
  const { id, name, call, pos } = event;
  return new Events({
    id,
    extrinsic: extrinsicEntity,
    name,
    method: call?.name,
    blockNumber: extrinsicEntity.blockNumber.toString(),
    indexInBlock: pos.toString(),
    createdAt: extrinsicEntity.createdAt,
    params: <Args>event.args,
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
    error: <ExtrinsicError>extrinsic.error,
    fee: extrinsic.fee || null,
    tip: extrinsic.tip || null,
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
  // Disabling linter as address.__kind comes as Id, Index, Address32 or Address20
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { __kind, value } = <Signature>signature.address;
  switch (__kind) {
    case "Id":
    case "Address32":
    case "Address20":
      return encodeAddress(value);
    default:
      throw new Error(`Address of type [${__kind}] not supported`);
  }
}

function getSignature(signature: SubstrateExtrinsicSignature): string {
  const { value } = <Signature>signature.signature;
  return value;
}
