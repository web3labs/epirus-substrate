import React from "react"
import { Edge, Page } from "../../types/pagination"
import BlockRow from "./BlockRow"
import List, { ListProps } from "../commons/List"
import Pagination from "../navigation/Pagination"
import SortBy from "../query/SortBy"
import ListQuery, { UpdateMode } from "../query/ListQuery"
import Filters from "../query/Filters"
import { LightBlock, Block } from "../../types/blocks"

export function buildArrayOf (n: number, f: (index: number) => Object) {
  return [...Array(n)].map((_, i) => f(i))
}

export function mockBlock (i: number) {
  return {
    id: i,
    timeStamp: new Date(),
    // this changes as time goes by - e.g., 22 hrs 23 mins ago
    blockTime: new Date(),
    // TODO: abhi - this should be an ... enum type with variants like Finalized, NotFinalized, etc.
    status: "Finalized",
    // TODO: abhi - should be a hash type?
    hash: "0x123",
    // TODO: abhi - should be a hash type?
    parentHash: "0x123",
    // TODO: abhi - should be a hash type?
    stateRoot: "0x123",
    // TODO: abhi - should be a hash type?
    extrinsicsRoot: "0x123",
    // TODO: abhi - should be an account type?
    collator: "n123p3455",
    specVersion: 53
  } as unknown as Block
}

export const mockBlockEdges = buildArrayOf(5, (i) => ({
  node: mockBlock(i)
})) as Edge<LightBlock>[]

const QUERY = `
query($where: BlockWhereInput = {}, $first: Int!, $after: String = null, $orderBy: [BlockOrderByInput!]! = [timestamp_DESC]) {
  blocksConnection(where: $where, orderBy: $orderBy, first: $first, after: $after) {
    totalCount
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      node {
        id
        height
        hash
        timestamp
        events {
          id
        }
        extrinsics {
          id
        }
      }
    }
  }
}
`
/*
query MyQuery {
  blocks {
    id
    parentHash
    stateRoot
    timestamp
    spec {
      specVersion
      blockHash
      id
    }
  }
}
*/

export const BLOCK_SORT_OPTIONS = [
  {
    name: "newest",
    value: "timestamp_DESC"
  },
  {
    name: "oldest",
    value: "timestamp_ASC"
  }
]

export default function BlockList ({
  pageQuery = { first: 5 },
  title,
  description,
  currentId,
  short = true,
  sortOptions,
  filterTypes
}: ListProps) {
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="blocksConnection"
    updateMode={UpdateMode.BEEPER}
    render={
      ({ data, setQueryInState, queryInState, beeper }) => {
        const page : Page<LightBlock> = data
        const sort = sortOptions
          ? <SortBy options={sortOptions}
            setQuery={setQueryInState}
            pageQuery={queryInState}
          />
          : undefined
        const filter = filterTypes
          ? <Filters
            filterTypes={filterTypes}
            setQuery={setQueryInState}
            pageQuery={queryInState}
          />
          : undefined
        return (
          <List
            title={title}
            description={description}
            sort={sort}
            filter={filter}
            drawer={beeper}
            footer={
              <Pagination
                page={page}
                pageQuery={queryInState}
                setQuery={setQueryInState}
              />
            }
            emptyMessage="No blocks to show"
          >
            {page?.edges.map(({ node }: Edge<LightBlock>) => (
              <BlockRow
                key={String(node.id)}
                obj={node}
                currentId={currentId}
                short={short}
              />
            ))}
          </List>
        )
      }}
  />
}
