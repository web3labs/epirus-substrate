import React, { useEffect, useRef, useState } from "react"
import useSquid, { SquidRefreshProps } from "../../hooks/useSquid"
import { PageQuery } from "../../types/pagination"
import objectHash from "../../utils/hashcode"
import { classNames } from "../../utils/strings"
import { PageLoading } from "../loading/Loading"

const DEFAULT_REFRESH_MS = 5000
const EMPTY_HASH = objectHash({})

export enum UpdateMode {
  // eslint-disable-next-line no-unused-vars
  AUTOMATIC,
  // eslint-disable-next-line no-unused-vars
  BEEPER
}

interface Props {
  query: string
  dataSelector: string
  pageQuery: PageQuery
  render: ({ data, queryInState, setQueryInState }:
    { data: any,
      queryInState: PageQuery,
      setQueryInState: (pageQuery: PageQuery) => void,
      beeper: JSX.Element | null
  }) => JSX.Element | null
  refresh?: SquidRefreshProps
  updateMode?: UpdateMode
}

export function Beeper ({
  setQueryInState,
  queryInState,
  data,
  dataUpdate
}: {
  setQueryInState: (pageQuery: PageQuery) => void,
  queryInState: PageQuery,
  data: any,
  dataUpdate: any
}) {
  const diffCount = dataUpdate.totalCount - data.totalCount
  const loadMore = diffCount > 0

  return <div className={classNames(
    "w-full overflow-hidden transition-all ease-in-out duration-250",
    loadMore ? "max-h-14 border-b" : "max-h-0 border-b-0"
  )}>
    {loadMore &&
    <button
      className="w-full p-4 link text-sm mouse shadow-inner bg-slate-50 focus:outline-none"
      onClick={() => {
      // After undefined instructs to go to page 1
      // timestamp makes cached queries per page stale
        setQueryInState({
          ...queryInState,
          after: undefined,
          timestamp: Date.now()
        })
      }}>
      <span>Show {diffCount} more</span>
    </button>}
  </div>
}

/**
 * ListQuery provides a convenient way to feed data lists
 * using a GraphQL endpoint.
 *
 * It supports two modes of updating the view with data changes:
 * 1. AUTOMATIC - updates the list data as it comes.
 * 2. BEEPER - updates the beeper component with the count diff
 *             allowing the user to control when to load the changes.
 *
 * By default refreshes the data every DEFAULT_REFRESH_MS.
 * To disable data polling set refresh property to undefined.
 *
 * @param props {Props} The component properties
 */
export default function ListQuery (props: Props) {
  const {
    query,
    dataSelector,
    render,
    pageQuery,
    refresh = {
      millis: DEFAULT_REFRESH_MS
    },
    updateMode = UpdateMode.AUTOMATIC
  } = props
  const hash = useRef(EMPTY_HASH)
  const [queryInState, setQueryInState] = useState(pageQuery)
  const [dataInDisplay, setDataInDisplay] = useState({ totalCount: 0, edges: undefined })

  const [result] = useSquid({
    query,
    variables: { ...queryInState },
    refresh
  })

  const { data, fetching } = result

  if (data && data[dataSelector]) {
    hash.current = objectHash(data[dataSelector])
  }

  useEffect(() => {
    // We want to update always on automatic or
    // on mount on other modes
    if (updateMode === UpdateMode.AUTOMATIC ||
      hash.current === EMPTY_HASH) {
      // Update state on new content
      setQueryInState({
        ...queryInState,
        timestamp: Date.now()
      })
    }
  }, [hash.current])

  useEffect(() => {
    if (data && data[dataSelector]) {
      setDataInDisplay(data[dataSelector])
    }
    // Clean up current hash
    return () => {
      hash.current = EMPTY_HASH
    }
  }, [fetching, queryInState])

  if (dataInDisplay.edges === undefined) {
    return <PageLoading
      loading={fetching}
    />
  }

  const beeper = updateMode === UpdateMode.BEEPER && data
    ? <Beeper
      data={dataInDisplay}
      dataUpdate={data[dataSelector]}
      queryInState={queryInState}
      setQueryInState={setQueryInState}
    />
    : null

  return <div className="w-full">
    {render({
      beeper,
      data: dataInDisplay,
      queryInState: queryInState as PageQuery,
      setQueryInState
    })}
  </div>
}
