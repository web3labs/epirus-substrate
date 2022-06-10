import React, { useEffect } from "react"
import { useQuery } from "urql"
import { Activity } from "../types/contracts"
import List from "./List"
import ActivityRow from "./substrate/ActivityRow"

export const LATEST_ACTIVITIES = `
query LatestContractActivity {
  activities(orderBy: createdAt_DESC, limit: 5) {
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

export default function LatestContractActivity () {
  const [result, reexecuteQuery] = useQuery({
    query: LATEST_ACTIVITIES
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

  const items = data?.activities.map((activity : Activity) => (
    <ActivityRow key={activity.id} activity={activity} />
  ))

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  return (
    <List title="Latest Transactions" description="Contract related extrinsics" items={items} />
  )
}
