import { Account } from "../types/accounts"
import { ContractCode } from "../types/codes"
import { Activity, ActivityType } from "../types/contracts"
import { Edge } from "../types/pagination"

export const mockExtrinsic = {
  id: "0000727898-000002-f645f",
  blockNumber: "727898",
  indexInBlock: "2",
  success: true,
  createdAt: new Date(),
  name: "module.call",
  args: {
    data: "0x0",
    storageDepositLimit: ""
  }
}

export const mockActivityEdges : Edge<Activity>[] = [
  {
    node: {
      type: ActivityType.CONTRACTCALL,
      action: "call",
      id: "0000727898-000002-f645f-CONTRACTCALL",
      createdAt: new Date(),
      extrinsic: mockExtrinsic,
      args: {
        data: "0x0"
      },
      to: {
        id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
      },
      from: {
        id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
      }
    }
  },
  {
    node: {
      type: ActivityType.CODEUPDATED,
      action: "call",
      id: "0000727898-000002-f645f-UPDATE",
      createdAt: new Date(),
      extrinsic: mockExtrinsic,
      args: {
        data: "0x0"
      },
      to: {
        id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
      },
      from: {
        id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
      }
    }
  },
  {
    node: {
      type: ActivityType.CONTRACTTERMINATE,
      action: "call",
      id: "0000727898-000002-f645f-TERMINATE",
      createdAt: new Date(),
      extrinsic: mockExtrinsic,
      args: {
        data: "0x0"
      },
      to: {
        id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
      },
      from: {
        id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
      }
    }
  },
  {
    node: {
      type: ActivityType.CONTRACT,
      action: "call",
      id: "0000727898-000002-f645f-CONTRACT",
      createdAt: new Date(),
      extrinsic: mockExtrinsic,
      args: {
        code: "0x0",
        data: "0x0"
      },
      to: {
        id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
      },
      from: {
        id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
      }
    }
  },
  {
    node:
        {
          type: "UNK",
          action: "unk",
          id: "0000727898-000002-f645f-UNK",
          createdAt: new Date(),
          extrinsic: mockExtrinsic,
          args: {
            data: "0x0"
          },
          to: {
            id: "5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"
          },
          from: {
            id: "5DVQiQYBcMUm5YeQ4YoG54aRsiBtDr6P4iSTUvxntdXCrYgz"
          }
        }
  }
]

export const mockAccountEdges = [...Array(5)].map((_, i) => ({
  node: {
    id: `5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5Rz${i}`,
    createdAt: new Date(),
    balance: {
      free: "0",
      reserved: "0"
    }
  }
})) as Edge<Account>[]

export function mockContractCode () {
  return {
    id: "0x38ec0f8fde303c179bcabaa40e987d6da361c664438f866a9967e58f92c39b56",
    createdAt: new Date(),
    createdFrom: mockExtrinsic,
    owner: {
      id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL"
    }
  } as unknown as ContractCode
}
