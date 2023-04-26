import React from "react"
import { Edge, Page } from "../../types/pagination"
import { Event } from "../../types/blocks"
import List, { ListProps } from "../commons/List"
import EventRow from "./EventRow"
import ListQuery, { UpdateMode } from "../query/ListQuery"
import SortBy from "../query/SortBy"
import Filters from "../query/Filters"
import Pagination from "../navigation/Pagination"

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

const QUERY = `
query($where: EventWhereInput = {} ,$first: Int = 5, $after: String = null, $orderBy: [EventOrderByInput!]! = [id_ASC]) {
  eventsConnection(where: $where, orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        id
        name
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
`

export default function EventList ({
  title,
  description,
  pageQuery = { first: 5 },
  short = true,
  sortOptions,
  filterTypes,
  currentId
}: ListProps) {
  // const data = mockEventEdges
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="eventsConnection"
    updateMode={UpdateMode.BEEPER}
    render={
      ({ data, setQueryInState, queryInState, beeper }) => {
        const page : Page<Event> = data
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
            emptyMessage="No events to show"
          >
            {page?.edges.map(({ node }: Edge<Event>) => (
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
    }/>
}
