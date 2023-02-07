import React from "react"
import { Event } from "../../../types/contracts"
import { Edge, Page } from "../../../types/pagination"
import List, { ListProps } from "../../commons/List"
import ListQuery, { UpdateMode } from "../../query/ListQuery"
import Pagination from "../../navigation/Pagination"
import SortBy from "../../query/SortBy"
import EventRow from "./EventRow"
import Filters from "../../query/Filters"

const QUERY = `
query($where: ContractEventWhereInput = {} ,$first: Int = 5, $after: String = null, $orderBy: [ContractEventOrderByInput!]! = [createdAt_DESC]) {
  contractEventsConnection(where: $where, orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        createdAt
        blockNumber
        indexInBlock
        contractAddress
        data
        extrinsic {
          blockNumber
          indexInBlock
          name
        }
        decodedEvent {
          id
          name
          args {
            id
            name
            type
            value
            displayName
          }
        }
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

export default function EventList ({
  title,
  description,
  pageQuery = { first: 5 },
  short = true,
  sortOptions,
  filterTypes,
  currentId
} : ListProps) {
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="contractEventsConnection"
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
            {page?.edges.map(({ node } : Edge<Event>) => (
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
