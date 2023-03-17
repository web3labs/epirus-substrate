import React from "react"
import { TabQuery } from "../navigation/Tabs"

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

export default function EventTab ({ currentId, where }: TabQuery) {
  return (
    <div>
      hello
    </div>
  )
}
