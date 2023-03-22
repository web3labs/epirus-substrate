import React from "react"
import { Event } from "../../types/contracts"
import { Edge } from "../../types/pagination"
import List, { ListProps } from "../commons/List"
import EventRow from "./EventRow"

export const EVENT_SORT_OPTIONS = [
  {
    name: "newest",
    value: "createdAt_DESC"
  },
  {
    name: "oldest",
    value: "createdAt_ASC"
  }
]

export function buildArrayOf (n: number, f: (index: number) => Object) {
  return [...Array(n)].map((_, i) => f(i))
}

export function mockExtrinsic (i: number) {
  return {
    id: String(i),
    blockNumber: "727898",
    indexInBlock: "2",
    success: true,
    createdAt: new Date(),
    name: "module.call",
    args: {
      data: "0x123",
      storageDepositLimit: ""
    }
  }
}

export const mockEventEdges = buildArrayOf(5, (i) => ({
  node: {
    id: String(i),
    blockNumber: 10,
    indexInBlock: 1,
    contractAddress: "nlsslksdjflwkj",
    createdAt: new Date(),
    data: "0x123",
    extrinsic: mockExtrinsic(i)
  }
})) as Edge<Event>[]

export default function EventList ({
  title,
  description,
  pageQuery = { first: 5 },
  short = true,
  sortOptions,
  filterTypes,
  currentId
}: ListProps) {
  const data = mockEventEdges
  return (
    <List
      title={title}
      description={description}
      emptyMessage="No events to show"
    >
      {data.map(({ node }: Edge<Event>) => (
        <EventRow
          key={node.id}
          obj={node}
          short={short}
          currentId={currentId}
        />
      ))}
    </List>
  )
}
