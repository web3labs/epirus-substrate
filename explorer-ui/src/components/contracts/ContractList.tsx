import React from "react"
import { LightContract } from "../../types/contracts"
import { Edge, Page } from "../../types/pagination"
import ContractRow from "./ContractRow"
import List, { ListProps } from "../commons/List"
import Pagination from "../navigation/Pagination"
import SortBy from "../query/SortBy"
import ListQuery from "../query/ListQuery"

const QUERY = `
query($where: ContractWhereInput = {}, $first: Int!, $after: String = "", $orderBy: [ContractOrderByInput!]! = [createdAt_DESC]) {
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

const SORT_OPTIONS = [
  {
    name: "newest",
    value: "createdAt_DESC"
  },
  {
    name: "oldest",
    value: "createdAt_ASC"
  }
]

export default function ContractList ({
  pageQuery = { first: 5 },
  title,
  description,
  currentId,
  short,
  sortable = false,
  filterable = false
} : ListProps) {
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="contractsConnection"
    render={
      ({ data, setQueryInState, queryInState }) => {
        const page : Page<LightContract> = data
        const sort = sortable
          ? <SortBy options={SORT_OPTIONS}
            setQuery={setQueryInState}
            pageQuery={queryInState}
          />
          : undefined

        return (
          <List
            title={title}
            description={description}
            sort={sort}
            footer={
              <Pagination
                page={page}
                pageQuery={queryInState}
                setQuery={setQueryInState}
              />
            }
            emptyMessage="No WASM contract deployed yet"
          >
            {page?.edges.map(({ node } : Edge<LightContract>) => (
              <ContractRow
                key={node.id}
                obj={node}
                currentId={currentId}
                short={short}
              />
            ))}
          </List>
        )
      }}
  />
}
