import React, { ReactNode, useState } from "react"
import { PageQuery } from "../../types/pagination"
import { FilterProps } from "../query/Filters"
import { Option } from "../commons/Select"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

interface Props {
    title?: JSX.Element | string
    description?: JSX.Element | string
    footer?: JSX.Element
    sort?: JSX.Element
    filter?: JSX.Element
    children?: ReactNode
    emptyMessage?: string
}

export function Row ({ children }: {children: ReactNode}) {
  return (
    <li className="flex flex-row flex-wrap gap-2 items-stretch justify-between pb-2 pt-4 px-6 hover:bg-over-hover">
      {children}
    </li>
  )
}

export function CollapsibleRow ({ children, collapsedDisplay, isOpen = false }: {children: ReactNode, collapsedDisplay: ReactNode, isOpen?: boolean}) {
  const [open, setOpen] = useState(isOpen)

  return (
    <li className="group flex flex-col pb-2 pt-4 px-6 hover:bg-over-hover">
      <div className="flex flex-row justify-between items-center cursor-pointer" onClick={() => setOpen(!open)}>
        {children}
        <div className="pl-5">
          {open
            ? <ChevronDownIcon className="text-gray-300 w-5 h-5 group-hover:text-gray-500" />
            : <ChevronRightIcon className="text-gray-300 w-5 h-5 group-hover:text-gray-500"/>
          }
        </div>
      </div>
      {open && collapsedDisplay}
    </li>
  )
}

export interface TypedRow<T> {
  obj: T,
  currentId?: string,
  short?: boolean
}

export interface ListProps {
  pageQuery?: PageQuery
  title?: JSX.Element | string
  description?: JSX.Element | string
  short?: boolean
  sortOptions?: Option[] | undefined
  filterTypes?: React.ComponentType<FilterProps> | React.ComponentType<FilterProps>[] | undefined
  currentId?: string
}

function isEmpty (element: ReactNode) {
  return (Array.isArray(element) && element.length === 0) ||
  element === null
}

export default function List ({
  title,
  description,
  emptyMessage,
  footer,
  filter,
  sort,
  children
}: Props) {
  return (
    <div className="relative flex flex-col grow w-full items-center justify-start">
      {title
        ? <div className="flex flex-col w-full p-4 border-b px-4 py-5 sm:px-6">
          <div className="flex flex-row items-center">
            <div className="flex flex-col gap-y-1">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
              {description &&
              <p className="max-w-2xl text-sm text-gray-500">{description}</p>
              }
            </div>
            <div className="flex ml-auto">
              <div className="flex flex-row flex-wrap gap-x-1 items-center">
                {filter}
                {sort}
              </div>
            </div>
          </div>
        </div>
        : <div className="w-full px-2 py-2 flex flex-row flex-wrap gap-x-1 justify-end">
          {filter}
          {sort}
        </div>
      }
      <ul className="flex flex-col divide-y divide-opacity-70 w-full">
        {isEmpty(children)
          ? <div className="w-full p-4 border-b px-4 py-5 sm:px-6 text-gray-400">
            {emptyMessage || "No items to show"}
          </div>
          : children }
      </ul>
      {footer && footer}
    </div>
  )
}
