export type Args = Record<string, string> | Record<string, number> | Record<string, undefined>;

export interface ExtrinsicError {
  __kind: string
  value: {
    error: string
    index: number
  };
}

export interface Extrinsic {
  id:string
  createdAt: Date
  blockNumber: string
  indexInBlock: string
  success: boolean
  args: Args
  blockHash?: string
  hash?:string
  name?:string
  signer?:string
  signature?:string
  tip?:string
  versionInfo?:string
  error?: ExtrinsicError
}

export interface LightExtrinsic {
  id: String,
  success: boolean,
  hash: String
}

export interface CallRef {
  name: string
}

export interface ExtrinsicForEvent {
  id: string, 
  call: CallRef
}
