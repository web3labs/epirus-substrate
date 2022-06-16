import React, { useMemo, useState } from "react"
import useSquid from "../../hooks/useSquid"
import { Activity } from "../../types/contracts"
import { Edge, Page } from "../../types/pagination"
import Hashcode from "../../utils/hashcode"
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

export default function ActivityList ({
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

  const hash = Hashcode.object(data === undefined ? {} : data.activitiesConnection)

  return useMemo(() => {
    if (data === undefined && fetching) {
      return (<Skeleton>
        <List title={title} description={description}>
          <ActivityRowSkeleton size={1}/>
        </List>
      </Skeleton>)
    }
    if (error) return <p>Oh no... {error.message}</p>

    console.log("List Activities Data changed", hash)

    const page : Page<Activity> = data.activitiesConnection
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
  }, [error, hash])
}
