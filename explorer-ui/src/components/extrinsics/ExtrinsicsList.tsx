import React from "react"
import { Edge } from "../../types/pagination"
import List, { ListProps } from "../commons/List"
import ExtrinsicRow from "./ExtrinsicRow"

import { Extrinsic } from "../../types/extrinsic"

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
    hash: "0x123",
    args: {
      data: "0x123",
      storageDepositLimit: ""
    }
  }
}

export const mockExtrinsicEdges = buildArrayOf(5, (i) => ({
  node: mockExtrinsic(i)
})) as Edge<Extrinsic>[]

export default function ExtrinsicsList ({
  title,
  description,
  pageQuery = { first: 5 },
  short = true,
  sortOptions,
  filterTypes,
  currentId
}: ListProps) {
  const data = mockExtrinsicEdges
  return (
    <List
      title={title}
      description={description}
      emptyMessage="No events to show"
    >
      {data.map(({ node }: Edge<Extrinsic>) => (
        <ExtrinsicRow
          key={node.id}
          obj={node}
          short={short}
          currentId={currentId}
        />
      ))}
    </List>
  )
}
