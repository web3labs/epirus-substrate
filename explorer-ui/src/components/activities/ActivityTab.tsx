import React from "react"
import ActivityList from "./ActivityList"

export default function ActivityTab ({ id }: {id:string}) {
  return (
    <ActivityList
      currentId={id}
      pageQuery={{
        first: 10,
        where: {
          from: {
            id_eq: id
          },
          OR: {
            to: {
              id_eq: id
            }
          }
        }
      }}
    />
  )
}
