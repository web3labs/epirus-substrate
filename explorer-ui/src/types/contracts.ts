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

export interface Contract {
    id: string,
    account: {
        id: string
    }
    trieId: string,
    deployedOn: Date,
    contractCode: {
      id: string
    }
    createdFrom: {
        blockNumber: number
    }
    deployer: {
        id: string,
        account?: {
          id: string
        } | null
    }
}
