import React from "react"
import { Page, PageQuery } from "../../types/pagination"

export default function Pagination ({ page, pageQuery, setQuery }: {
    page: Page<any>, pageQuery: PageQuery, setQuery: (pageQuery: PageQuery) => void
  }) {
  const { pageInfo, totalCount } = page
  const { first } = pageQuery
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } = pageInfo

  if (hasNextPage || hasPreviousPage) {
    return (
      <div className="w-full py-3 px-3 flex mt-auto items-center justify-between border-t border-gray-200">

        <div className="flex-1 flex justify-between items-center">
          <div className="text-xs">
        Showing {startCursor} to {endCursor} of {totalCount}
          </div>
          <div className="ml-auto space-x-2">
            {hasPreviousPage &&
            <span
              onClick={() => setQuery(Object.assign({}, pageQuery,
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
              onClick={() => setQuery(Object.assign({}, pageQuery,
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

      </div>
    )
  }

  // Don't print anything
  return null
}
