import {
  BatchProcessorItem,
  BatchContext,
  SubstrateCall,
  SubstrateExtrinsic,
  SubstrateBlock,
} from "@subsquid/substrate-processor";
import { Store } from "@subsquid/typeorm-store";

export type Item<P> = BatchProcessorItem<P>;

export type Ctx<P> = BatchContext<Store, Item<P>>;

export interface CallHandlerParams<P> {
  ctx: Ctx<P>;
  call: SubstrateCall;
  extrinsic: SubstrateExtrinsic;
  block: SubstrateBlock;
}

export interface Event {
  id: string;
  name: string;
  indexInBlock: number;
  call?: SubstrateCall | null | undefined;
  extrinsic?: SubstrateExtrinsic | null | undefined;
  args: Record<string, unknown>;
  phase: "Initialization" | "ApplyExtrinsic" | "Finalization";
  pos: number;
}

export interface EventHandlerParams<P> {
  ctx: Ctx<P>;
  event: Event;
  block: SubstrateBlock;
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
