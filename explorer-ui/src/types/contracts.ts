import { AccountRef, Account } from "./accounts"
import { Args, Extrinsic } from "./extrinsic"

export interface Activity {
  id: string,
  type: string,
  action: string,
  to: AccountRef,
  from: AccountRef,
  createdAt: Date,
  args: Args,
  extrinsic: Extrinsic
}

export interface Event {
  id: string,
  contractAddress: string,
  createdAt: Date,
  data: string,
  extrinsic: Extrinsic
}

export interface CodeHashChange {
  id: string
  newCodeHash: string
  oldCodeHash: string
  changedAt: Date
  extrinsic: Extrinsic
}

export type LightContract = {
  id: string,
  account: AccountRef
  trieId: string,
  createdAt: Date,
  contractCode: {
    id: string
  }
  createdFrom: {
    blockNumber: string
  }
  deployer: AccountRef
}

export interface Contract extends LightContract {
  salt: string
  trieId : string
  storageDeposit: string
  contractCode: {
    code: string
    id: string
    removedAt : Date
    createdAt: Date
  }
  account: Account
  createdFrom: Extrinsic
  terminatedAt: Date
  terminatedFrom: Extrinsic
  terminationBeneficiary: Account
  codeHashChanges: CodeHashChange[]
}
