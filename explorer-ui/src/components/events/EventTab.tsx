import React from "react"
import EventList from "./EventList"

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
    />
  )
}
