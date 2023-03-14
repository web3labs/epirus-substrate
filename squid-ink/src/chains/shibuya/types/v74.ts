import type {Result, Option} from './support'

export interface ContractInfo {
    trieId: Uint8Array
    codeHash: Uint8Array
    storageBytes: number
    storageItems: number
    storageByteDeposit: bigint
    storageItemDeposit: bigint
    storageBaseDeposit: bigint
}
