import { AccountRef } from "./accounts"
import { Extrinsic } from "./extrinsic"

export interface ContractCode {
  id: string,
  code: string,
  createdAt: Date,
  removedOn?: Date,
  createdFrom: Extrinsic,
  owner: AccountRef,
  contractsDeployed: {id: string}[]
}
