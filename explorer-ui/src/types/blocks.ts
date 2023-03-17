export interface BlockRef {
  id: string,
}

export type LightBlock = {
  block: BlockRef,
  trieId: string,
  createdAt: Date,
}

export interface Block extends LightBlock {
  timeStamp: Date
  // this changes as time goes by - e.g., 22 hrs 23 mins ago
  blockTime: Date
  // TODO: abhi - this should be an ... enum type with variants like Finalized, NotFinalized, etc.
  status : String
  // TODO: abhi - should be a hash type?
  hash: String
  // TODO: abhi - should be a hash type?
  parentHash: String
  // TODO: abhi - should be a hash type?
  stateRoot: String
  // TODO: abhi - should be a hash type?
  extrinsicsRoot: String
  // TODO: abhi - should be an account type?
  collator: String
  specVersion: number
}
