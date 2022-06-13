import React from "react"
import useSquid from "../../hooks/useSquid"
import { Activity } from "../../types/contracts"
import { Edge, Page, PageQuery } from "../../types/pagination"
import List, { ListFooter, ListHeader } from "../List"
import Skeleton from "../loading/Skeleton"
import ActivityRow, { ActivityRowSkeleton } from "./ActivityRow"

const QUERY = `
query($first: Int!, $after: String = "", $orderBy: [ActivityOrderByInput!]! = [createdAt_DESC]) {
  activitiesConnection(orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        action
        createdAt
        from
        id
        to
        type
        args {
          name
          type
          value
        }
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
const DefaultPageQuery : PageQuery = {
  first: 5,
  after: ""
}

export default function ListContractActivities ({ query = DefaultPageQuery } : {query?: PageQuery}) {
  const [result] = useSquid({
    query: QUERY,
    variables: { ...query }
  })

  const { data, fetching, error } = result

  const latestTransactionsHeader = <ListHeader
    title="Latest Transactions"
    description="Contract related extrinsics"/>

  if (fetching) {
    return (<Skeleton>
      <List header={latestTransactionsHeader}>
        <ActivityRowSkeleton size={5}/>
      </List>
    </Skeleton>)
  }
  if (error) return <p>Oh no... {error.message}</p>

  const page : Page<Activity> = data?.activitiesConnection

  return (
    <List header={latestTransactionsHeader} footer={
      <ListFooter pageInfo={page.pageInfo} totalCount={page.totalCount} />
    }>
      {page?.edges.map(({ node } : Edge<Activity>) => (
        <ActivityRow key={node.id} activity={node} />
      ))}
    </List>
  )
}
