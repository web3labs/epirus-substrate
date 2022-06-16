import React, { useMemo, useState } from "react"
import { Account } from "../../types/accounts"
import { Edge, Page } from "../../types/pagination"
import List, { ListProps } from "../List"
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
      }
    }
  }
}
`
const SORT_OPTIONS = [
  {
    name: "id",
    value: "id_ASC"
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
      return <p>...</p>
    }
    if (error) return <p>Oh no... {error.message}</p>

    const page : Page<Account> = data.accountsConnection
    const sort = sortable
      ? <SortBy options={SORT_OPTIONS}
        setQuery={setQueryInState}
        query={queryInState}
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
            query={queryInState}
            setQuery={setQueryInState}
          />
        }>
        {page?.edges.map(({ node } : Edge<Account>) => (
          <AccountRow key={node.id} account={node} short={short} />
        ))}
      </List>
    )
  }, [error, hash])
}
