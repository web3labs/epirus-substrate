import {
  BatchContext,
  SubstrateExtrinsic,
  SubstrateBlock,
  QualifiedName,
  SubstrateCall,
} from "@subsquid/substrate-processor";
import {
  CallItem,
  EventItem,
} from "@subsquid/substrate-processor/lib/interfaces/dataSelection";
import { Store } from "@subsquid/typeorm-store";

export type Item = EventItem<"*", true> | CallItem<"*", true>;

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

export type Ctx = BatchContext<
  Store,
  EventItem<"*", false> | CallItem<"*", false>
>;

export interface EventHandlerParams {
  ctx: Ctx;
  event: Event;
  block: SubstrateBlock;
}

export interface Event {
  id: string;
  name: string;
  pos: number;
  call?: SubstrateCall;
  extrinsic?: SubstrateExtrinsic;
  args: Record<string, unknown>;
}
/*
| (Omit<
  { id: string; name: string; pos: number } & {
    call?: undefined;
  } & {} & { extrinsic?: undefined } & {},
  "name"
> & { name: "*" })
| (Omit<
  { id: string; name: string; pos: number } & {} & {
    call: {
      id: string;
      name: string;
      pos: number;
      success: boolean;
    };
  } & {} & {},
  "name"
> & { name: "*" })
*/

export interface ContractInstantiatedArgs {
  code?: string;
  data?: string;
  salt?: string;
  gasLimit?: bigint;
  value?: bigint;
  codeHash?: string;
}

export interface ContractCodeStoredArgs {
  data?: string;
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
