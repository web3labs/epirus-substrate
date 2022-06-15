export interface Arg {
  type: string,
  name: string,
  value: string
}

export interface Activity {
  id: string,
  type: string,
  action: string,
  to: string,
  from: string,
  createdAt: Date,
  args: Arg[]
}

export type LightContract = {
  id: string,
  account: {
    id: string
  }
  trieId: string,
  createdAt: Date,
  contractCode: {
    id: string
  }
  createdFrom: {
    blockNumber: string
  }
  deployer: {
    id: string,
    account?: {
      id: string
    } | null
  }
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
  account: {
    balance: {
      reserved: string
      miscFrozen:string
      free:string
      feeFrozen:string
    }
    id:string
    tags:string[]
  }
  createdFrom: {
    blockHash: string
    blockNumber: string
    id:string
    hash:string
    name:string
    signer:string
    signature:string
    tip:string
    versionInfo:string
  }
}
