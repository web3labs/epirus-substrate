import React from "react"
import { Event } from "../../types/contracts"
import { Edge, Page } from "../../types/pagination"
import List, { ListProps } from "../commons/List"
import ListQuery from "../query/ListQuery"
import Pagination from "../Pagination"
import SortBy from "../SortBy"
import EventRow from "./EventRow"

const QUERY = `
query($where: ContractEmittedEventWhereInput = {} ,$first: Int = 5, $after: String = "", $orderBy: [ContractEmittedEventOrderByInput!]! = [createdAt_DESC]) {
  contractEmittedEventsConnection(where: $where, orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        createdAt
        id
        contractAddress
        data
        extrinsic {
          id
          name
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
const SORT_OPTIONS = [
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
  short = false,
  sortable = false,
  filterable = false,
  currentId
} : ListProps) {
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="contractEmittedEventsConnection"
    render={
      ({ data, setQueryInState, queryInState }) => {
        const page : Page<Event> = data
        const sort = sortable
          ? <SortBy options={SORT_OPTIONS}
            setQuery={setQueryInState}
            pageQuery={queryInState}
          />
          : undefined

        return (
          <List
            title={title}
            description={description}
            sort={sort}
            footer={
              <Pagination
                page={page}
                pageQuery={queryInState}
                setQuery={setQueryInState}
              />
            }
            emptyMessage="No contract related events yet"
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
