import React, { useMemo, useState } from "react"
import { LightContract } from "../../types/contracts"
import { Edge, Page } from "../../types/pagination"
import ContractRow from "./ContractRow"
import List, { ListProps } from "../List"
import useSquid from "../../hooks/useSquid"
import Pagination from "../Pagination"
import SortBy from "../SortBy"
import Hashcode from "../../utils/hashcode"

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

  const hash = Hashcode.object(data === undefined ? {} : data.contractsConnection)

  return useMemo(() => {
    if (data === undefined && fetching) {
      return <p>...</p>
    }
    if (error) return <p>Oh no... {error.message}</p>

    console.log("List Contracts Data changed", hash)

    const page : Page<LightContract> = data.contractsConnection
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
        {page?.edges.map(({ node } : Edge<LightContract>) => (
          <ContractRow key={node.id} contract={node} short={short} />
        ))}
      </List>
    )
  }, [error, hash])
}
