import React from "react"
import { TabQuery } from "../navigation/Tabs"
import ExtrinsicsList from "./ExtrinsicsList"

export function extrinsicsByBlockId (id: string) {
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

export default function ExtrinsicsTab ({ currentId, where }: TabQuery) {
  return (
    <ExtrinsicsList
      currentId={currentId}
      pageQuery={{
        first: 10,
        where
      }}
    />
  )
}
