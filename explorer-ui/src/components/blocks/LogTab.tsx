import React from "react"
import { TabQuery } from "../navigation/Tabs"

export function logByAccount (id: string) {
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

export default function LogTab ({ currentId, where }: TabQuery) {
  return <div>hello</div>
}
