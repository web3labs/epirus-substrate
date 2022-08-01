import { Account } from "../types/accounts"
import { Edge } from "../types/pagination"
import { emptyPage, testPageOf } from "./utils"

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

export default {
  connections: {
    accountsConnection: testPageOf(edges)
  },
  emptyConnections: {
    accountsConnection: emptyPage()
  },
  single: testPageOf([
    {
      id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL",
      createdAt: new Date(),
      balance: {
        free: "0",
        reserved: "0"
      }
    }
  ], "accounts"),
  empty: emptyPage("accounts")
}
