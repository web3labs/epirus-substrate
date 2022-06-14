import React from "react"
import { Page, PageQuery } from "../types/pagination"

interface Props {
    header?: JSX.Element
    footer?: JSX.Element
    children: JSX.Element | JSX.Element[]
}

export function Cols ({ children }: {children: JSX.Element | JSX.Element[]}) {
  return (
    <div className="flex flex-row gap-2 justify-between items-stretch">
      {children}
    </div>)
}

export function Row ({ children }: {children: JSX.Element | JSX.Element[]}) {
  return (
    <li className="text-sm pb-2 pt-4 pl-4 pr-4">
      {children}
    </li>
  )
}

export function ListHeader ({ title, description }: {title:string, description?: string}) {
  return (
    <div className="flex flex-col w-full p-4 border-b px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      {description &&
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
      }
    </div>
  )
}

export function ListFooter ({ page, query, setQuery }: {
  page: Page<any>, query: PageQuery, setQuery: (query: PageQuery) => void
}) {
  const { pageInfo, totalCount } = page
  const { first } = query
  return (
    <div className="w-full py-3 px-3 flex items-center justify-between border-t border-gray-200">
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
              className="relative inline-flex items-center text-sm text-gray-900 hover:cursor-pointer"
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
              className="relative inline-flex items-center text-sm text-gray-900 hover:cursor-pointer"
            >
            Next
            </span>
          }
        </div>
      </div>
    </div>
  )
}

export default function List ({ header, footer, children }: Props) {
  return (
    <div className="flex flex-col w-full items-center justify-start">
      {header}
      <ul className="flex flex-col divide-y w-full">
        {children}
      </ul>
      {footer}
    </div>
  )
}
