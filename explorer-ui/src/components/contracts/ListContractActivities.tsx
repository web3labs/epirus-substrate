import React from "react"
import useSquid from "../../hooks/useSquid"
import { Activity } from "../../types/contracts"
import { Edge, Page, PageQuery } from "../../types/pagination"
import List, { ListFooter } from "../List"
import Skeleton from "../loading/Skeleton"
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
const DefaultPageQuery : PageQuery = {
  first: 5,
  after: "",
  where: {}
}

export default function ListContractActivities ({
  header,
  query = DefaultPageQuery,
  short = false
} : {header?: JSX.Element, query?: PageQuery, short?: boolean}) {
  const [result] = useSquid({
    query: QUERY,
    variables: { ...query }
  })

  const { data, fetching, error } = result

  if (fetching) {
    return (<Skeleton>
      <List header={header}>
        <ActivityRowSkeleton size={5}/>
      </List>
    </Skeleton>)
  }
  if (error) return <p>Oh no... {error.message}</p>

  const page : Page<Activity> = data?.activitiesConnection

  return (
    <List header={header} footer={
      <ListFooter pageInfo={page.pageInfo} totalCount={page.totalCount} />
    }>
      {page?.edges.map(({ node } : Edge<Activity>) => (
        <ActivityRow key={node.id} activity={node} short={short} />
      ))}
    </List>
  )
}
