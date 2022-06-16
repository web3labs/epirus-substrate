import React, { useMemo, useState } from "react"
import { LightAccount } from "../../types/contracts"
import { Edge, Page } from "../../types/pagination"
import List, { ListProps } from "../List"
import useSquid from "../../hooks/useSquid"
import Pagination from "../Pagination"
import Hashcode from "../../utils/hashcode"
import AccountRow from "./AccountRow"

const QUERY = `
query($first: Int!, $after: String = "", $orderBy: [ContractOrderByInput!]! = [createdAt_DESC]) {
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
        createdAt
        balance {
          free
          reserved
          frozen
        }
        contract {
          id
        }
      }
    }
  }
}
`

export default function AccountList ({
  query = { first: 5 },
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

    const page : Page<LightAccount> = data.accountsConnection
    const sort = undefined

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
        {page?.edges.map(({ node } : Edge<LightAccount>) => (
          <AccountRow key={node.id} account={node} short={short} />
        ))}
      </List>
    )
  }, [error, hash])
}
