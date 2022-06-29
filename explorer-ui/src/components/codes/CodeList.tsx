import React from "react"
import { ContractCode } from "../../types/codes"
import { Edge, Page } from "../../types/pagination"
import List, { ListProps } from "../commons/List"
import ListQuery from "../query/ListQuery"
import Pagination from "../query/Pagination"
import SortBy from "../query/SortBy"
import CodeRow from "./CodeRow"

const QUERY = `
query($where: ContractCodeWhereInput = {} ,$first: Int = 5, $after: String = "", $orderBy: [ContractCodeOrderByInput!]! = [createdAt_DESC]) {
  contractCodesConnection(where: $where, orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        createdAt
        id
        createdFrom {
          args {
            name
            type
            value
          }
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
        removedOn
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

export default function ActivityList ({
  title,
  description,
  pageQuery = { first: 5 },
  short,
  sortable = false,
  filterable = false,
  currentId
} : ListProps) {
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="contractCodesConnection"
    render={
      ({ data, setQueryInState, queryInState }) => {
        const page : Page<ContractCode> = data
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
            emptyMessage="No contract related activities yet"
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
