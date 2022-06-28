import { AccountRef, Account } from "./accounts"
import { Arg, Extrinsic } from "./extrinsic"

export interface Activity {
  id: string,
  type: string,
  action: string,
  to: AccountRef,
  from: AccountRef,
  createdAt: Date,
  args: Arg[]
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
    removedOn : Date
    createdAt: Date
  }
  account: Account
  createdFrom: Extrinsic
}
