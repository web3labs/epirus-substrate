import React from "react"
import { LightContract } from "../../types/contracts"
import { Edge, Page } from "../../types/pagination"
import ContractRow from "./ContractRow"
import List, { ListProps } from "../List"
import Pagination from "../Pagination"
import SortBy from "../SortBy"
import ListQuery from "../ListQuery"

const QUERY = `
query($first: Int!, $after: String = "", $orderBy: [ContractOrderByInput!]! = [createdAt_DESC]) {
  contractsConnection(orderBy: $orderBy, first: $first, after: $after) {
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
  short = false,
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
            emptyMessage="No WASM contracted deployed yet"
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
