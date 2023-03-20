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
import { LightBlock } from "../../types/blocks"
import { mockBlockEdges } from "../../_mocks/data"

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
