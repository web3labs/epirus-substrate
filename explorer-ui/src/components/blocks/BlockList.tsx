import React from "react"
import { Edge /* , Page */ } from "../../types/pagination"
import BlockRow from "./BlockRow"
import List, { ListProps } from "../commons/List"
/*
import Pagination from "../navigation/Pagination"
import SortBy from "../query/SortBy"
import ListQuery, { UpdateMode } from "../query/ListQuery"
import Filters from "../query/Filters"
*/
import { LightBlock, Block } from "../../types/blocks"

export function buildArrayOf (n: number, f: (index: number) => Object) {
  return [...Array(n)].map((_, i) => f(i))
}

export function mockBlock (i: number) {
  return {
    id: i,
    extrinsicsCount: 10,
    eventsCount: 10,
    timeStamp: new Date(),
    // this changes as time goes by - e.g., 22 hrs 23 mins ago
    blockTime: new Date(),
    // TODO: abhi - this should be an ... enum type with variants like Finalized, NotFinalized, etc.
    status: "Finalized",
    // TODO: abhi - should be a hash type?
    hash: "0x123",
    // TODO: abhi - should be a hash type?
    parentHash: "0x123",
    // TODO: abhi - should be a hash type?
    stateRoot: "0x123",
    // TODO: abhi - should be a hash type?
    extrinsicsRoot: "0x123",
    // TODO: abhi - should be an account type?
    collator: "n123p3455",
    specVersion: 53
  } as unknown as Block
}

export const mockBlockEdges = buildArrayOf(5, (i) => ({
  node: mockBlock(i)
})) as Edge<LightBlock>[]
/*
const QUERY = `
query($where: ContractWhereInput = {}, $first: Int!, $after: String = null, $orderBy: [ContractOrderByInput!]! = [createdAt_DESC]) {
  contractsConnection(where: $where, orderBy: $orderBy, first: $first, after: $after) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      node {
        salt
        id
        createdAt
        trieId
        deployer {
          id
          contract {
            id
          }
        }
        createdFrom {
          blockNumber
        }
        contractCode {
          id
        }
        account {
          id
          contract {
            id
          }
        }
      }
    }
  }
}
`
*/

export const BLOCK_SORT_OPTIONS = [
  {
    name: "newest",
    value: "createdAt_DESC"
  },
  {
    name: "oldest",
    value: "createdAt_ASC"
  }
]

export default function BlockList ({
  pageQuery = { first: 5 },
  title,
  description,
  currentId,
  short = true,
  sortOptions,
  filterTypes
} : ListProps) {
  const data = mockBlockEdges
  return (
    <List
      title={title}
      description={description}
      emptyMessage="No contracts to show"
    >
      {data.map(({ node } : Edge<LightBlock>) => (
        <BlockRow
          key={String(node.id)}
          obj={node}
          currentId={currentId}
          short={short}
        />
      ))}
    </List>
  )
}
