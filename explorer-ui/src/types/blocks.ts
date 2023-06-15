import { ExtrinsicForEvent } from "../types/extrinsic"
// this type is for displaying the block data on the main page
// where we show the blocks list
export type LightBlock = {
  id: String;
  height: number;
  hash: String;
  timestamp: Date;
  events?: [{
    id: string
  }]
  extrinsics?: [{
    id: string
  }]
};

export interface Spec {
  specVersion: number
}

// this type is to display an individual block data on its own page
export interface Block extends LightBlock {
  hash: String;
  parentHash: String;
  stateRoot: String;
  extrinsicsRoot: String;
  spec: Spec;
}

export interface Event {
  id: string;
  name: string;
  extrinsic: ExtrinsicForEvent;
}
