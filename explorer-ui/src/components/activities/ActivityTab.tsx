import React from "react"
import { TabQuery } from "../navigation/Tabs"
import ActivityList from "./ActivityList"

export function activityByAccount (id: string) {
  return {
    from: {
      id_eq: id
    },
    OR: {
      to: {
        id_eq: id
      }
    }
  }
}

export default function ActivityTab ({ currentId, where }: TabQuery) {
  return (
    <ActivityList
      currentId={currentId}
      pageQuery={{
        first: 10,
        where
      }}
    />
  )
}
