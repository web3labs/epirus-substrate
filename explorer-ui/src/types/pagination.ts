
export interface PageQuery {
  first: number
  after?: string
  orderBy?: string
  where?: any,
  timestamp?: number
}

export interface Edge<T> {
  node: T
}

export interface PageInfo {
  hasNextPage: Boolean
  hasPreviousPage: Boolean
  startCursor: string
  endCursor: string
}

export interface Page<T> {
  totalCount: number
  edges: Edge<T>[]
  pageInfo: PageInfo
}
