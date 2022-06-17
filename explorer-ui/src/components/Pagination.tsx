import React from "react"
import { Page, PageQuery } from "../types/pagination"

export default function Pagination ({ page, query, setQuery }: {
    page: Page<any>, query: PageQuery, setQuery: (query: PageQuery) => void
  }) {
  const { pageInfo, totalCount } = page
  const { first } = query
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } = pageInfo

  if (hasNextPage || hasPreviousPage) {
    return (
      <div className="flex-1 flex justify-between items-center border-t border-gray-200">
        <div className="text-xs">
        Showing {startCursor} to {endCursor} of {totalCount}
        </div>
        <div className="ml-auto space-x-2">
          {hasPreviousPage &&
            <span
              onClick={() => setQuery(Object.assign({}, query,
                {
                  after: (parseInt(startCursor) - (first + 1)).toString()
                })
              )}
              className="link relative inline-flex items-center text-sm cursor-pointer"
            >
            Previous
            </span>
          }
          {hasNextPage &&
            <span
              onClick={() => setQuery(Object.assign({}, query,
                {
                  after: endCursor
                })
              )}
              className="link relative inline-flex items-center text-sm cursor-pointer"
            >
            Next
            </span>
          }
        </div>
      </div>
    )
  }

  // Don't print anything
  return null
}
