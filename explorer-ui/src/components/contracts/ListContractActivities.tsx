import React, { useState } from "react"
import useSquid from "../../hooks/useSquid"
import { Activity } from "../../types/contracts"
import { Edge, Page } from "../../types/pagination"
import List, { ListProps } from "../List"
import Skeleton from "../loading/Skeleton"
import Pagination from "../Pagination"
import SortBy from "../SortBy"
import ActivityRow, { ActivityRowSkeleton } from "./ActivityRow"

const QUERY = `
query($where: ActivityWhereInput = {} ,$first: Int = 5, $after: String = "", $orderBy: [ActivityOrderByInput!]! = [createdAt_DESC]) {
  activitiesConnection(where: $where, orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        action
        createdAt
        from
        id
        to
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

export default function ListContractActivities ({
  title,
  description,
  query = { first: 5 },
  short = false,
  sortable = false,
  filterable = false
} : ListProps) {
  const [queryInState, setQueryInState] = useState(query)

  const [result] = useSquid({
    query: QUERY,
    variables: { ...queryInState }
  })

  const { data, fetching, error } = result

  if (data === undefined && fetching) {
    return (<Skeleton>
      <List title={title} description={description}>
        <ActivityRowSkeleton size={query.first}/>
      </List>
    </Skeleton>)
  }
  if (error) return <p>Oh no... {error.message}</p>

  const page : Page<Activity> = data?.activitiesConnection
  const sort = sortable
    ? <SortBy options={SORT_OPTIONS}
      setQuery={setQueryInState}
      query={queryInState}
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
          query={queryInState}
          setQuery={setQueryInState}
        />
      }>
      {page?.edges.map(({ node } : Edge<Activity>) => (
        <ActivityRow key={node.id} activity={node} short={short} />
      ))}
    </List>
  )
}
