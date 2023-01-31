import React from "react"
import DateRangeFilter from "../../query/filters/DateRangeFilter"
import { textFilterOf } from "../../query/filters/TextFilter"
import EventList, { EVENT_SORT_OPTIONS } from "./EventList"

export default function EventTab ({ id }: {id:string}) {
  return (
    <EventList
      currentId={id}
      pageQuery={{
        first: 10,
        where: {
          contractAddress_eq: id
        }
      }}
      sortOptions={EVENT_SORT_OPTIONS}
      filterTypes={[
        DateRangeFilter,
        textFilterOf(
          {
            selector: "event",
            label: "Event Name",
            template: value => (
              { decodedEvent: { name_eq: value } }
            ),
            placeholder: "e.g. transfer",
            inputTransformer: (input) => input.toLowerCase()
          }
        )
      ]}
    />
  )
}
