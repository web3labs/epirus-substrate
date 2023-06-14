import { Account } from "../types/accounts"
import { LightBlock, Block, Event as BlockEvent } from "../types/blocks"
import { LightExtrinsic } from "../types/extrinsic"
import { ContractCode } from "../types/codes"
import { Activity, ActivityType, Contract, DecodedElement, Event } from "../types/contracts"
import { Edge } from "../types/pagination"

import { buildArrayOf, randomAccountId, randomCodeHash, randomHex, randomId } from "./utils"

const mockDecodedActivity: DecodedElement = {
  id: "0000000001-000001-54600-CONTRACT",
  name: "new",
  args: [
    {
      id: "0000000001-000001-54600-CONTRACT-totalSupply",
      name: "totalSupply",
      type: "Balance",
      value: "888888888000000000000",
      displayName: undefined
    }
  ]
}

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
      decodedActivity: mockDecodedActivity,
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
    storageInfo: {
      storageBaseDeposit: "100000"
    }
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

export function mockBlock(i: number) {
  return {
    id: i,
    height: 1,
    spec: { specVersion: 52},
    timestamp: new Date(),
    status: "Finalized",
    hash: "0x123",
    parentHash: "0x123",
    stateRoot: "0x123",
    extrinsicsRoot: "0x123",
    specVersion: 53,
  } as unknown as Block;
}

export const mockBlockEdges = buildArrayOf(5, (i) => ({
  node: mockBlock(i),
})) as Edge<LightBlock>[];

export function mockLightExtrinsic(i: number) {
  return {
    id: i,
    success: true,
    hash: "0x123"
  }
}

export const mockLightExtrinsicEdges = buildArrayOf(5, (i) => ({
  node: mockLightExtrinsic(i),
})) as Edge<LightExtrinsic>[];

export function mockBlockEvent(i: number) {
  return {
    id: i,
    name: "test event",
    extrinsic: {
      id: "0000", 
      call: {
        name: "test call"
      }
    }
  } as unknown as BlockEvent;
}

export const mockBlockEventEdges = buildArrayOf(5, (i) => ({
  node: mockBlockEvent(i),
})) as Edge<BlockEvent>[];

export function mockExtrinsicPageType() {
  return {
    id:1,
    tip: "tip",
    success: true,
    fee: 1,
    block: { 
      id: 1,
      height: 1,
      timestamp: new Date(),
      hash: "0x123",
    },
    call: {
      name: "call"
    },
    hash: "0x5454"
  }
}
