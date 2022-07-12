import React from "react"
import { TabQuery } from "../navigation/Tabs"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { textFilterOf } from "../query/filters/TextFilter"
import CodeList, { CODE_SORT_OPTIONS } from "./CodeList"

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
      sortOptions={CODE_SORT_OPTIONS}
      filterTypes={[
        DateRangeFilter,
        textFilterOf({
          selector: "id_eq",
          label: "Code Hash",
          template: value => (
            { id_eq: value }
          ),
          placeholder: "Hash..."
        })
      ]}
    />
  )
}
