import type {Result, Option} from './support'

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

export interface Weight {
    refTime: bigint
    proofSize: bigint
}

export interface PrefabWasmModule {
    instructionWeightsVersion: number
    initial: number
    maximum: number
    code: Uint8Array
    determinism: Determinism
}

export type Determinism = Determinism_Deterministic | Determinism_AllowIndeterminism

export interface Determinism_Deterministic {
    __kind: 'Deterministic'
}

export interface Determinism_AllowIndeterminism {
    __kind: 'AllowIndeterminism'
}
