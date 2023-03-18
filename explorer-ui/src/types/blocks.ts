// this type is for displaying the block data on the main page
// where we show the blocks list
export type LightBlock = {
  id: String,
  extrinsicsCount: number,
  eventsCount: number,
  // is this the block creation time
  timeStamp: Date
}

// this type is to display an individual block data on its own page
export interface Block extends LightBlock {
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
