import React from "react"
import { TabQuery } from "../navigation/Tabs"
import EventList from "./EventList"

export function eventsByExtrinsicId (id: string) {
  return {
    extrinsic: { id_eq: id }
  }
}

export default function EventsTab ({ currentId, where }: TabQuery) {
  return (
    <EventList
      currentId={currentId}
      pageQuery={{
        first: 10,
        where
      }}
    />
  )
}
