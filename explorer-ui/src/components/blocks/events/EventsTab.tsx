import React from "react"
import { TabQuery } from "../../navigation/Tabs"
import EventList from "./EventList"

export function eventsByBlockId (id: string) {
  return { block: { id_eq: id } }
}

export const EVENT_SORT_OPTIONS = [
  {
    name: "newest",
    value: "id_DESC"
  },
  {
    name: "oldest",
    value: "id_ASC"
  }
]

export default function EventsTab ({ currentId, where }: TabQuery) {
  return (
    <EventList
      currentId={currentId}
      sortOptions={EVENT_SORT_OPTIONS}
      pageQuery={{
        first: 10,
        where
      }}
    />
  )
}
