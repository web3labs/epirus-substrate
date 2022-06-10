import React from "react"
import { useQuery } from "urql"
import { Activity } from "../types/contracts"
import List from "./List"
import ActivityRow from "./substrate/ActivityRow"

export const LatestContractActivityQuery = `
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
  const [result] = useQuery({
    query: LatestContractActivityQuery
  })

  const { data, fetching, error } = result

  if (fetching) return <p>Loading...</p>
  if (error) return <p>Oh no... {error.message}</p>

  const items = data.activities.map((activity : Activity) => {
    return <ActivityRow key={activity.id} activity={activity} />
  })

  return (
    <List title="Latest Transactions" description="Contract related extrinsics" items={items} />
  )
}
