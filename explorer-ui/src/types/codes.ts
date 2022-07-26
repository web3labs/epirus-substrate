import { AccountRef } from "./accounts"
import { Extrinsic } from "./extrinsic"

export interface ContractCode {
  id: string,
  code: string,
  createdAt: Date,
  removedAt?: Date,
  createdFrom: Extrinsic,
  removedFrom?: Extrinsic,
  owner: AccountRef,
  contractsDeployed?: {id: string}[]
}
