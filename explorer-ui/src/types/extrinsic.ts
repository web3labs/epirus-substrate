export interface Arg {
  type: string,
  name: string,
  value: string
}

export interface Extrinsic {
  blockHash: string
  blockNumber: string
  id:string
  hash:string
  name:string
  signer:string
  signature:string
  tip:string
  versionInfo:string
  args: Arg[]
}
