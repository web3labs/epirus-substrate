import { Account } from "../types/accounts"
import { ContractCode } from "../types/codes"
import { Activity, ActivityType, Contract, Event } from "../types/contracts"
import { Edge } from "../types/pagination"

import { buildArrayOf, randomAccountId, randomCodeHash, randomHex, randomId } from "./utils"

export const mockExtrinsic = {
  id: randomId(),
  blockNumber: "727898",
  indexInBlock: "2",
  success: true,
  createdAt: new Date(),
  name: "module.call",
  args: {
    data: randomHex(),
    storageDepositLimit: ""
  }
}

export const mockActivityEdges : Edge<Activity>[] = [
  {
    node: {
      type: ActivityType.CONTRACTCALL,
      action: "call",
      id: randomId() + "CONTRACTCALL",
      createdAt: new Date(),
      extrinsic: mockExtrinsic,
      args: {
        data: randomHex()
      },
      to: {
        id: randomAccountId()
      },
      from: {
        id: randomAccountId()
      }
    }
  },
  {
    node: {
      type: ActivityType.CODEUPDATED,
      action: "update",
      id: randomId() + "UPDATE",
      createdAt: new Date(),
      extrinsic: mockExtrinsic,
      args: {
        data: randomHex()
      },
      to: {
        id: randomAccountId()
      },
      from: {
        id: randomAccountId()
      }
    }
  },
  {
    node: {
      type: ActivityType.CONTRACTTERMINATE,
      action: "terminate",
      id: randomId() + "TERMINATE",
      createdAt: new Date(),
      extrinsic: mockExtrinsic,
      args: {
        data: randomHex()
      },
      to: {
        id: randomAccountId()
      },
      from: {
        id: randomAccountId()
      }
    }
  },
  {
    node: {
      type: ActivityType.CONTRACT,
      action: "instantiate",
      id: randomId() + "CONTRACT",
      createdAt: new Date(),
      extrinsic: mockExtrinsic,
      args: {
        code: randomHex(),
        data: randomHex()
      },
      to: {
        id: randomAccountId()
      },
      from: {
        id: randomAccountId()
      }
    }
  },
  {
    node:
        {
          type: "UNK",
          action: "unk",
          id: randomId() + "UNK",
          createdAt: new Date(),
          extrinsic: mockExtrinsic,
          args: {
            data: randomHex()
          },
          to: {
            id: randomAccountId()
          },
          from: {
            id: randomAccountId()
          }
        }
  }
]

export function mockAccount (i = 0) {
  return {
    id: randomAccountId(),
    createdAt: new Date(),
    balance: {
      free: "0",
      reserved: "0",
      miscFrozen: "0",
      feeFrozen: "0"
    },
    codesOwned: i % 2
      ? [
        { id: randomAccountId() }
      ]
      : undefined,
    contractsDeployed: i % 2
      ? [
        { id: randomAccountId() }
      ]
      : undefined,
    tags: []
  } as Account
}

export const mockAccountEdges = buildArrayOf(5, (i) => ({
  node: mockAccount(i)
})) as Edge<Account>[]

export function mockContractCode (i = 0) {
  return {
    id: randomCodeHash(),
    createdAt: new Date(),
    createdFrom: mockExtrinsic,
    owner: {
      id: randomAccountId()
    },
    contractsDeployed: i % 2
      ? [
        { id: randomAccountId() }
      ]
      : undefined
  } as unknown as ContractCode
}

export const mockContractCodeEdges = buildArrayOf(5, (i) => ({
  node: mockContractCode(i)
})) as Edge<ContractCode>[]

export function mockContract () {
  return {
    id: randomAccountId(),
    createdAt: new Date(),
    createdFrom: mockExtrinsic,
    contractCode: mockContractCode(),
    account: mockAccount(),
    deployer: mockAccount(),
    salt: randomCodeHash(),
    trieId: randomId(),
    storageDeposit: "100000"
  } as unknown as Contract
}

export const mockContractEdges = buildArrayOf(5, () => ({
  node: mockContract()
})) as Edge<Contract>[]

export const mockEventEdges = buildArrayOf(5, () => ({
  node: {
    id: randomId(),
    blockNumber: 10,
    indexInBlock: 1,
    contractAddress: randomAccountId(),
    createdAt: new Date(),
    data: randomHex(),
    extrinsic: mockExtrinsic
  }
})) as Edge<Event>[]
