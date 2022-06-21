import React, { useMemo, useState } from "react"
import { Account } from "../../types/accounts"
import { Edge, Page } from "../../types/pagination"
import List, { EmptyList, ListProps } from "../List"
import useSquid from "../../hooks/useSquid"
import Pagination from "../Pagination"
import Hashcode from "../../utils/hashcode"
import AccountRow from "./AccountRow"
import SortBy from "../SortBy"

const QUERY = `
query($first: Int!, $after: String = "", $orderBy: [AccountOrderByInput!]! = [id_ASC]) {
  accountsConnection(orderBy: $orderBy, first: $first, after: $after) {
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
  query = { first: 10 },
  title,
  description,
  currentId,
  short = false,
  sortable = false,
  filterable = false
} : ListProps) {
  const [queryInState, setQueryInState] = useState(query)

  const [result] = useSquid({
    query: QUERY,
    variables: { ...queryInState }
  })

  const { data, fetching, error } = result

  const hash = Hashcode.object(data === undefined ? {} : data.accountsConnection)

  return useMemo(() => {
    if (data === undefined && fetching) {
      return null
    }
    if (error) return <p>Oh no... {error.message}</p>

    const page : Page<Account> = data.accountsConnection
    const sort = sortable
      ? <SortBy options={SORT_OPTIONS}
        setQuery={setQueryInState}
        query={queryInState}
      />
      : undefined

    let rows: JSX.Element[]
    if (page.totalCount === 0) {
      rows = [EmptyList({ from: "account" })]
    } else {
      rows = page?.edges.map(({ node } : Edge<Account>) => (
        <AccountRow
          key={node.id}
          obj={node}
          short={short}
          currentId={currentId}
        />
      ))
    }

    return (
      <List
        title={title}
        description={description}
        sort={sort}
        footer={
          <Pagination
            page={page}
            query={queryInState}
            setQuery={setQueryInState}
          />
        }>
        {rows}
      </List>
    )
  }, [error, hash])
}
