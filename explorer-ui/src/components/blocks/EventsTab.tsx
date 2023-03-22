import React from "react"
import { TabQuery } from "../navigation/Tabs"
import EventList from "./EventList"

export function eventsByExtrinsicId (id: string) {
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
