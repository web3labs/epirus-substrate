import React from "react"
import { LightContract } from "../../types/contracts"
import { Edge, Page, PageQuery } from "../../types/pagination"
import ContractRow from "./ContractRow"
import List from "../List"
import useSquid from "../../hooks/useSquid"

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

export default function ListContracts ({ query = { first: 5 }, header } : {query?: PageQuery, header?:JSX.Element}) {
  const [result] = useSquid({
    query: QUERY,
    variables: { ...query }
  })

  const { data, fetching, error } = result

  if (fetching) {
    return <p>...</p>
  }
  if (error) return <p>Oh no... {error.message}</p>

  const page : Page<LightContract> = data?.contractsConnection

  return (
    <List header={header}>
      {page?.edges.map(({ node } : Edge<LightContract>) => (
        <ContractRow key={node.id} contract={node} />
      ))}
    </List>
  )
}
