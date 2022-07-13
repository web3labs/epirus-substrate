import React, { useMemo, useRef, useState } from "react"
import useSquid, { SquidRefreshProps } from "../../hooks/useSquid"
import { PageQuery } from "../../types/pagination"
import objectHash from "../../utils/hashcode"
import { PageLoading } from "../loading/Loading"

interface Props {
  query: string
  dataSelector: string
  pageQuery: PageQuery
  render: ({ data, queryInState, setQueryInState }:
    {data: any, queryInState: PageQuery, setQueryInState: (pageQuery: PageQuery) => void}) => JSX.Element | null
  refresh?: SquidRefreshProps
}

export default function ListQuery (props: Props) {
  const {
    query,
    dataSelector,
    render,
    pageQuery,
    refresh = {
      millis: 10000
    }
  } = props
  const hash = useRef(objectHash({}))
  const [queryInState, setQueryInState] = useState(pageQuery)

  const [result] = useSquid({
    query,
    variables: { ...queryInState },
    refresh
  })

  const { data, fetching } = result

  if (data && data[dataSelector]) {
    hash.current = objectHash(data[dataSelector])
  }

  return useMemo(() => {
    if (data === undefined && fetching) {
      return <PageLoading
        loading={fetching}
      />
    }

    return render({
      data: data[dataSelector],
      queryInState: queryInState as PageQuery,
      setQueryInState
    })
  }, [hash.current])
}
