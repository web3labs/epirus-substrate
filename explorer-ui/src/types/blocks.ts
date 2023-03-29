import { Extrinsic } from "../types/extrinsic"
import { DecodedElement } from "../types/contracts"
// this type is for displaying the block data on the main page
// where we show the blocks list
export type LightBlock = {
  id: String;
  height: number;
  // is this the block creation time
  timestamp: Date;
};

export interface Spec {
  specVersion: number
}

// this type is to display an individual block data on its own page
export interface Block extends LightBlock {
  // TODO: abhi - this should be an ... enum type with variants like Finalized, NotFinalized, etc.
  // status: String;
  // TODO: abhi - should be a hash type?
  hash: String;
  // TODO: abhi - should be a hash type?
  parentHash: String;
  // TODO: abhi - should be a hash type?
  stateRoot: String;
  // TODO: abhi - should be a hash type?
  extrinsicsRoot: String;
  // TODO: abhi - should be an account type?
  // collator: String;
  spec: Spec;
}

export interface Event {
  id: string;
  blockNumber: string;
  indexInBlock: string;
  contractAddress: string;
  createdAt: Date;
  data: string;
  extrinsic: Extrinsic;
  decodedEvent?: DecodedElement;
}
