import React from "react"
import { Edge, Page } from "../../types/pagination"
import ListQuery, { UpdateMode } from "../query/ListQuery"
import List, { ListProps } from "../commons/List"
import ExtrinsicRow from "./ExtrinsicRow"
import SortBy from "../query/SortBy"
import { Extrinsic, LightExtrinsic } from "../../types/extrinsic"
import Filters from "../query/Filters"
import Pagination from "../navigation/Pagination"

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

const QUERY = `
query($where: ExtrinsicWhereInput = {} ,$first: Int = 5, $after: String = null, $orderBy: [ExtrinsicOrderByInput!]! = [id_ASC]) {
  extrinsicsConnection(where: $where, orderBy: $orderBy, after: $after, first: $first) {
    totalCount
    edges {
      node {
        id
        hash
        success
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

export default function ExtrinsicsList ({
  title,
  description,
  pageQuery = { first: 5 },
  short = true,
  sortOptions,
  filterTypes,
  currentId
}: ListProps) {
  // const data = mockExtrinsicEdges
  return <ListQuery
    pageQuery={pageQuery}
    query={QUERY}
    dataSelector="extrinsicsConnection"
    updateMode={UpdateMode.BEEPER}
    render={
      ({ data, setQueryInState, queryInState, beeper }) => {
        const page : Page<LightExtrinsic> = data
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
            emptyMessage="No extrinsics to show"
          >
            {page?.edges.map(({ node }: Edge<LightExtrinsic>) => (
              <ExtrinsicRow
                key={String(node.id)}
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
