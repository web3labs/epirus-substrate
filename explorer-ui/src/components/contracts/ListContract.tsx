import React, { useEffect } from "react"
import { useQuery } from "urql"
import { Contract } from "../../types/contracts"
import { Edge, Page, PageQuery } from "../../types/pagination"
import ContractRow from "./ContractRow"
import List, { ListHeader } from "../List"

const QUERY = `
query($first: Int!, $after: String = "", $orderBy: [ContractOrderByInput!]! = [deployedOn_DESC]) {
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
        deployedOn
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
        }
      }
    }
  }
}
`

export default function ListContract ({ query = { first: 5 } } : {query?: PageQuery}) {
  const [result, reexecuteQuery] = useQuery({
    query: QUERY,
    variables: { ...query }
  })

  useEffect(() => {
    if (result.fetching) return

    // Refresh every second...
    const timerId = setInterval(() => {
      reexecuteQuery({ requestPolicy: "cache-and-network" })
    }, 1000000)

    return () => clearTimeout(timerId)
  }, [result.fetching, reexecuteQuery])

  const { data, fetching, error } = result

  const latestContractsHeader = <ListHeader
    title="Latest Contracts"
    description="Contracts deployed"/>

  if (fetching) {
    return <p>...</p>
  }
  if (error) return <p>Oh no... {error.message}</p>

  const page : Page<Contract> = data?.contractsConnection

  return (
    <List header={latestContractsHeader}>
      {page?.edges.map(({ node } : Edge<Contract>) => (
        <ContractRow key={node.id} contract={node} />
      ))}
    </List>
  )
}
