import type {Result} from './support'

export type MultiAddress = MultiAddress_Id | MultiAddress_Index | MultiAddress_Raw | MultiAddress_Address32 | MultiAddress_Address20

export interface MultiAddress_Id {
  __kind: 'Id'
  value: Uint8Array
}

export interface MultiAddress_Index {
  __kind: 'Index'
  value: null
}

export interface MultiAddress_Raw {
  __kind: 'Raw'
  value: Uint8Array
}

export interface MultiAddress_Address32 {
  __kind: 'Address32'
  value: Uint8Array
}

export interface MultiAddress_Address20 {
  __kind: 'Address20'
  value: Uint8Array
}

export interface PrefabWasmModule {
  instructionWeightsVersion: number
  initial: number
  maximum: number
  code: Uint8Array
}

export interface RawContractInfo {
  trieId: Uint8Array
  codeHash: Uint8Array
  storageDeposit: bigint
}

export interface OwnerInfo {
  owner: Uint8Array
  deposit: bigint
  refcount: bigint
}
