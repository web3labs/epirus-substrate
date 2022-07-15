import {
  BatchContext,
  SubstrateExtrinsic,
  SubstrateBlock,
  QualifiedName,
  SubstrateCall,
} from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";

export type Item = {
  kind: string;
  name: string;
  event?: SubsquidEvent;
  call?: SubsquidCall;
  extrinsic?: SubstrateExtrinsic;
};

export type EventItem = {
  kind: string;
  name: string;
  event: Event;
};

export type CallItem = {
  kind: string;
  name: string;
  call: SubstrateCall;
  extrinsic: SubstrateExtrinsic;
};

export interface SubsquidEvent {
  id: string;
  name: string;
  call?: SubstrateCall;
  extrinsic?: SubstrateExtrinsic;
}

export interface SubsquidCall {
  id: string;
  name: QualifiedName;
  parent?: SubstrateCall;
  /**
   * Position of the call in a joint list of events, calls and extrinsics,
   * which determines data handlers execution order.
   */
  pos: number;
}

export type Ctx = BatchContext<Store, Item>;

export interface EventHandlerParams {
  ctx: Ctx;
  event: Event;
  block: SubstrateBlock;
}

export interface Event {
  id: string;
  name: string;
  indexInBlock: number;
  call?: SubstrateCall;
  extrinsic?: SubstrateExtrinsic;
  args: Record<string, unknown>;
}

export interface ContractInstantiatedArgs {
  code?: string;
  data?: string;
  salt?: string;
  gasLimit?: bigint;
  value?: bigint;
  codeHash?: string;
}

export interface ContractCodeUpdatedArgs {
  data?: string;
  newCodeHash?: string;
  oldCodeHash?: string;
}

export type EventHandlerCallback = (
  ctx: Ctx,
  event: Event,
  block: SubstrateBlock
) => Promise<void>;

export type ExtrinsicHandlerCallback = (
  ctx: Ctx,
  call: SubstrateCall,
  extrinsic: SubstrateExtrinsic,
  block: SubstrateBlock
) => Promise<void>;

export interface EventHandler {
  name: string;
  handle: EventHandlerCallback;
}

export interface ExtrinsicHandler {
  name: string;
  handle: ExtrinsicHandlerCallback;
}

export type ItemHandler = (ctx: Ctx, block: SubstrateBlock) => Promise<void>;

export interface ExtrinsicError {
  __kind: string;
  value: ModuleError;
}

export interface ModuleError {
  error: string;
  index: number;
}
