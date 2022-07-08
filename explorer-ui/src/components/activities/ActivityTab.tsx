import React from "react"
import { TabQuery } from "../navigation/Tabs"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import ActivityList, { ACTIVITY_SORT_OPTIONS } from "./ActivityList"

export function activityByAccount (id: string) {
  return {
    OR: [
      {
        from: {
          id_eq: id
        }
      },
      {
        to: {
          id_eq: id
        }
      }
    ]
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
      sortOptions={ACTIVITY_SORT_OPTIONS}
      filterTypes={[
        DateRangeFilter
      ]}
    />
  )
}
