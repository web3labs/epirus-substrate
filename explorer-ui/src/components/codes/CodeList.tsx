import React from "react"
import { ContractCode } from "../../types/codes"
import { Edge, Page } from "../../types/pagination"
import List, { ListProps } from "../commons/List"
import ListQuery from "../query/ListQuery"
import Pagination from "../navigation/Pagination"
import SortBy from "../query/SortBy"
import CodeRow from "./CodeRow"
import Filters from "../query/Filters"

const QUERY = `
query($where: ContractCodeWhereInput = {} ,$first: Int = 5, $after: String = null, $orderBy: [ContractCodeOrderByInput!]! = [createdAt_DESC]) {
  contractCodesConnection(where: $where, orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        createdAt
        id
        createdFrom {
          args
        }
        owner {
          id
          contract {
            id
          }
        }
        contractsDeployed {
          id
        }
        removedAt
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
`
export const CODE_SORT_OPTIONS = [
  {
    name: "newest",
    value: "createdAt_DESC"
  },
  {
    name: "oldest",
    value: "createdAt_ASC"
  }
]

export default function CodeList ({
  title,
  description,
  pageQuery = { first: 5 },
  short = true,
  sortOptions,
  filterTypes,
  currentId
} : ListProps) {
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="contractCodesConnection"
    render={
      ({ data, setQueryInState, queryInState }) => {
        const page : Page<ContractCode> = data
        const sort = sortOptions
          ? <SortBy options={sortOptions}
            setQuery={setQueryInState}
            pageQuery={queryInState}
          />
          : undefined
        const filter = filterTypes
          ? <Filters
            filterTypes={filterTypes}
            setQuery={setQueryInState}
            pageQuery={queryInState}
          />
          : undefined

        return (
          <List
            title={title}
            description={description}
            sort={sort}
            filter={filter}
            footer={
              <Pagination
                page={page}
                pageQuery={queryInState}
                setQuery={setQueryInState}
              />
            }
            emptyMessage="No codes to show"
          >
            {page?.edges.map(({ node } : Edge<ContractCode>) => (
              <CodeRow
                key={node.id}
                obj={node}
                short={short}
                currentId={currentId}
              />
            ))}
          </List>
        )
      }
    }/>
}
