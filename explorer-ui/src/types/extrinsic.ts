export type Args = Record<string, string> | Record<string, number> | Record<string, undefined>;

export interface Extrinsic {
  blockHash: string
  blockNumber: string
  indexInBlock: string
  id:string
  hash:string
  name:string
  signer:string
  signature:string
  tip:string
  versionInfo:string
  args: Args
}
