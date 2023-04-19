import type {Result, Option} from './support'

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
