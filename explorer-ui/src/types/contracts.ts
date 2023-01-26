/* eslint-disable no-unused-vars */
import { AccountRef, Account } from "./accounts"
import { Args, Extrinsic } from "./extrinsic"

export enum ActivityType {
  CONTRACT = "CONTRACT",
  CONTRACTCALL = "CONTRACTCALL",
  CODESTORED = "CODESTORED",
  CODEUPDATED = "CODEUPDATED",
  CONTRACTTERMINATE = "CONTRACTTERMINATE",
}

export interface DecodedArg {
  id: string
  name: string
  type: string
  value: string
  displayName?: string
}

export interface DecodedElement {
  id: string
  name: string
  args: DecodedArg[]
}

export interface Activity {
  id: string,
  type: string,
  action: string,
  to: AccountRef,
  from: AccountRef,
  createdAt: Date,
  args: Args,
  extrinsic: Extrinsic
  decodedActivity?: DecodedElement
}

export interface Event {
  id: string,
  blockNumber: string,
  indexInBlock: string,
  contractAddress: string,
  createdAt: Date,
  data: string,
  extrinsic: Extrinsic
  decodedEvent?: DecodedElement
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
  storageInfo: {
    storageBaseDeposit: string
    storageByteDeposit: string
    storageItemDeposit: string
    storageItems: number
    storageBytes: number
  }
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
