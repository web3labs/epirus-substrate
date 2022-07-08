import React from "react"
import { Activity } from "../../types/contracts"
import { Edge, Page } from "../../types/pagination"
import List, { ListProps } from "../commons/List"
import ListQuery from "../query/ListQuery"
import Pagination from "../navigation/Pagination"
import SortBy from "../query/SortBy"
import ActivityRow from "./ActivityRow"
import Filters from "../query/Filters"

const QUERY = `
query($where: ActivityWhereInput = {} ,$first: Int = 5, $after: String = "", $orderBy: [ActivityOrderByInput!]! = [createdAt_DESC]) {
  activitiesConnection(where: $where, orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        action
        createdAt
        from {
          id
          contract {
            id
          }
        }
        id
        to {
          id
          contract {
            id
          }
        }
        type
        args {
          name
          type
          value
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
export const ACTIVITY_SORT_OPTIONS = [
  {
    name: "newest",
    value: "createdAt_DESC"
  },
  {
    name: "oldest",
    value: "createdAt_ASC"
  }
]

export default function ActivityList ({
  title,
  description,
  pageQuery = { first: 5 },
  short,
  sortOptions,
  filterTypes,
  currentId
} : ListProps) {
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="activitiesConnection"
    render={
      ({ data, setQueryInState, queryInState }) => {
        const page : Page<Activity> = data
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
            footer={
              <Pagination
                page={page}
                pageQuery={queryInState}
                setQuery={setQueryInState}
              />
            }
            emptyMessage="No activities to show"
          >
            {page?.edges.map(({ node } : Edge<Activity>) => (
              <ActivityRow
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
