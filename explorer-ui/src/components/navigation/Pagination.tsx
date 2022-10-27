import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/outline"
import React from "react"
import { Page, PageQuery } from "../../types/pagination"

export default function Pagination ({ page, pageQuery, setQuery }: {
    page: Page<any>, pageQuery: PageQuery, setQuery: (pageQuery: PageQuery) => void
  }) {
  if (page === undefined) {
    return null
  }

  const { pageInfo, totalCount } = page
  const { first } = pageQuery
  const { hasNextPage, hasPreviousPage, startCursor, endCursor } = pageInfo

  function getStartCursor () {
    const start = (parseInt(startCursor) - (first + 1))
    return start < 1 ? undefined : start.toString()
  }

  if (hasNextPage || hasPreviousPage) {
    return (
      <div className="w-full flex justify-between items-center border-t border-gray-200 mt-auto">
        <div className="text-xs px-3 py-2 text-gray-500">
            Showing {startCursor} to {endCursor} of {totalCount}
        </div>
        {(hasNextPage || hasPreviousPage) &&
        <nav role="navigation" className="ml-auto flex">
          {hasPreviousPage
            ? <span
              onClick={() => setQuery(Object.assign({}, pageQuery,
                {
                  after: getStartCursor()
                })
              )}
              aria-label="previous page"
              className="flex link cursor-pointer p-2 text-xs items-center"
            >
              <ChevronLeftIcon height={18} width={18} aria-hidden="true" />
            </span>
            : <span className="flex items-center p-2 text-xs text-gray-300">
              <ChevronLeftIcon height={18} width={18} aria-hidden="true" />
            </span>
          }
          {hasNextPage
            ? <span
              onClick={() => setQuery(Object.assign({}, pageQuery,
                {
                  after: endCursor
                })
              )}
              aria-label="next page"
              className="flex link cursor-pointer p-2 text-xs items-center"
            >
              <ChevronRightIcon height={18} width={18} aria-hidden="true" />
            </span>
            : <span className="flex items-center p-2 text-xs text-gray-300">
              <ChevronRightIcon height={18} width={18} aria-hidden="true" />
            </span>
          }
        </nav>
        }
      </div>
    )
  }

  // Don't print anything
  return null
}
