import React, { useEffect } from "react"
import { useQuery } from "urql"
import { Activity } from "../../types/contracts"
import { Edge, Page, PageQuery } from "../../types/pagination"
import List, { ListFooter, ListHeader } from "../List"
import Skeleton from "../loading/Skeleton"
import ActivityRow, { ActivityRowSkeleton } from "./ActivityRow"

const LATEST_ACTIVITIES = `
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
  first: 2,
  after: "2"
}

export default function ListContractActivity ({ query = DefaultPageQuery } : {query?: PageQuery}) {
  const [result, reexecuteQuery] = useQuery({
    query: LATEST_ACTIVITIES,
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
