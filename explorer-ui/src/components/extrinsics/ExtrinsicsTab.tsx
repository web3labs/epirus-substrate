import React from "react"
import { TabQuery } from "../navigation/Tabs"
import ExtrinsicsList from "./ExtrinsicsList"

export function extrinsicsByBlockHash (hash: string) {
  return { block: { hash_eq: hash } }
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
