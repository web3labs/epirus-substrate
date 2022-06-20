import type {Result} from './support'

export interface AccountData {
  free: bigint
  reserved: bigint
  miscFrozen: bigint
  feeFrozen: bigint
}

export interface AccountInfoWithTripleRefCount {
  nonce: number
  consumers: number
  providers: number
  sufficients: number
  data: AccountData
}
