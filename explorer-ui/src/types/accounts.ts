export interface AccountRef {
  id: string,
  contract?: {
    id: string
  }
}

export type Account = {
  balance: {
    reserved: string
    miscFrozen:string
    free:string
    feeFrozen:string
  }
  contractsDeployed?: [{
    id: string
  }]
  codesOwned?: [{
    id: string
  }]
  contract?: {
    id: string
  }
  id:string
  tags:string[]
  createdAt: Date
}
