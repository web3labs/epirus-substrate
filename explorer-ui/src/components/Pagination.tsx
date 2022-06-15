import React from "react"
import { Page, PageQuery } from "../types/pagination"

export default function Pagination ({ page, query, setQuery }: {
    page: Page<any>, query: PageQuery, setQuery: (query: PageQuery) => void
  }) {
  const { pageInfo, totalCount } = page
  const { first } = query
  return (
    <div className="flex-1 flex justify-between items-center">
      <div className="text-xs">
        Showing {pageInfo.startCursor} to {pageInfo.endCursor} of {totalCount}
      </div>
      <div className="ml-auto space-x-2">
        {pageInfo.hasPreviousPage &&
            <span
              onClick={() => setQuery({
                first,
                after: (parseInt(pageInfo.startCursor) - (first + 1)).toString()
              })}
              className="link relative inline-flex items-center text-sm cursor-pointer"
            >
            Previous
            </span>
        }
        {pageInfo.hasNextPage &&
            <span
              onClick={() => setQuery({
                first,
                after: pageInfo.endCursor
              })}
              className="link relative inline-flex items-center text-sm cursor-pointer"
            >
            Next
            </span>
        }
      </div>
    </div>
  )
}
