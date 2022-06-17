import React from "react"
import { PageQuery } from "../types/pagination"

interface Props {
    title?: JSX.Element | string
    description?: JSX.Element | string
    footer?: JSX.Element
    sort?: JSX.Element
    filter?: JSX.Element
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
    <li className="text-sm pb-2 pt-4 pl-4 pr-4 hover:bg-gray-50">
      {children}
    </li>
  )
}

export interface TypedRow<T> {
  obj: T,
  currentId?: string,
  short?: boolean
}

export interface ListProps {
  query?: PageQuery
  title?: JSX.Element | string
  description?: JSX.Element | string
  short?: boolean
  sortable?: boolean
  filterable?: boolean
  currentId?: string
}

export default function List ({ title, description, footer, filter, sort, children }: Props) {
  return (
    <div className="flex flex-col grow w-full items-center justify-start">
      {title &&
      <div className="flex flex-col w-full p-4 border-b px-4 py-5 sm:px-6">
        <div className="flex flex-row items-center">
          <div className="flex flex-col gap-y-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
            {description &&
              <p className="max-w-2xl text-sm text-gray-500">{description}</p>
            }
          </div>
          <div className="flex ml-auto">
            <div className="flex flex-row gap-x-2 items-center">
              {sort && <>
                <span className="text-gray-500">Sort by</span>
                {sort}
              </>
              }
              {filter}
            </div>
          </div>
        </div>
      </div>
      }
      <ul className="flex flex-col divide-y w-full">
        {children}
      </ul>
      {footer && footer}
    </div>
  )
}
