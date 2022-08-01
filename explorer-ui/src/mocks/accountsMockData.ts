import { Account } from "../types/accounts"
import { Edge } from "../types/pagination"

const edges = [...Array(5)].map((_, i) => ({
  node: {
    id: `5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5Rz${i}`,
    createdAt: new Date(),
    balance: {
      free: "0",
      reserved: "0"
    }
  }
})) as Edge<Account>[]

export const accountsConnectionMockData = {
  accountsConnection: {
    totalCount: 10,
    edges,
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: "1",
      endCursor: "5"
    }
  }
}

export const noAccountsConnectionMockData = {
  accountsConnection: {
    totalCount: 0,
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
      endCursor: ""
    }
  }
}

export const noAccountsMockData = {
  totalCount: 0,
  accounts: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: "",
    endCursor: ""
  }
}

export const accountsMockData = {
  totalCount: 1,
  accounts: [
    {
      id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL",
      createdAt: new Date(),
      balance: {
        free: "0",
        reserved: "0"
      }
    }
  ],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: "1",
    endCursor: "1"
  }
}
