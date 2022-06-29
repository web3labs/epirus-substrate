import React from "react"
import { TabQuery } from "../navigation/Tabs"
import CodeList from "./CodeList"

export function codeByOwner (id: string) {
  return {
    owner: {
      id_eq: id
    }
  }
}

export default function CodeTab ({ currentId, where }: TabQuery) {
  return (
    <CodeList
      currentId={currentId}
      pageQuery={{
        first: 10,
        where
      }}
    />
  )
}
