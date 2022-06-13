import React, { useEffect } from "react"
import { useQuery } from "urql"
import { Activity } from "../types/contracts"
import List, { ListHeader } from "./List"
import Skeleton from "./loading/Skeleton"
import ActivityRow, { ActivityRowSkeleton } from "./substrate/ActivityRow"

export const LATEST_ACTIVITIES = `
query($limit: Int!) {
  activities(orderBy: createdAt_DESC, limit: $limit) {
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
`

export default function LatestContractActivity ({ limit = 5 } : {limit?: number}) {
  const [result, reexecuteQuery] = useQuery({
    query: LATEST_ACTIVITIES,
    variables: { limit }
  })

  useEffect(() => {
    if (result.fetching) return

    // Refresh every second...
    const timerId = setInterval(() => {
      reexecuteQuery({ requestPolicy: "cache-and-network" })
    }, 1000)

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

  return (
    <List header={latestTransactionsHeader}>
      {data?.activities.map((activity : Activity) => (
        <ActivityRow key={activity.id} activity={activity} />
      ))}
    </List>
  )
}
