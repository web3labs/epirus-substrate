import React from "react"
import { Account } from "../../types/accounts"
import { Edge, Page } from "../../types/pagination"
import List, { ListProps } from "../commons/List"
import Pagination from "../navigation/Pagination"
import AccountRow from "./AccountRow"
import SortBy from "../query/SortBy"
import ListQuery from "../query/ListQuery"
import Filters from "../query/Filters"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { textFilterOf } from "../query/filters/TextFilter"

const QUERY = `
query($where: AccountWhereInput = {}, $first: Int!, $after: String = "", $orderBy: [AccountOrderByInput!]! = [id_ASC]) {
  accountsConnection(where: $where, orderBy: $orderBy, first: $first, after: $after) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      node {
        id
        tags
        codesOwned {
          id
        }
        contractsDeployed {
          id
        }
        balance {
          free
          reserved
          feeFrozen
        }
        contract {
          id
        }
        createdAt
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
  },
  {
    name: "highest balance",
    value: "balance_free_DESC"
  },
  {
    name: "lowest balance",
    value: "balance_free_ASC"
  }
]

export default function AccountList ({
  pageQuery = { first: 10 },
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
    dataSelector="accountsConnection"
    render={
      ({ data, setQueryInState, queryInState }) => {
        const page : Page<Account> = data
        const sort = sortable
          ? <SortBy options={SORT_OPTIONS}
            setQuery={setQueryInState}
            pageQuery={queryInState}
          />
          : undefined
        const filter = filterable
          ? <Filters
            filterTypes={[
              DateRangeFilter,
              textFilterOf({
                selector: "id_eq",
                label: "Account",
                template: value => (
                  { id_eq: value }
                ),
                placeholder: "Address..."
              })
            ]}
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
            emptyMessage="No accounts on chain yet"
          >
            {page?.edges.map(({ node } : Edge<Account>) => (
              <AccountRow
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
