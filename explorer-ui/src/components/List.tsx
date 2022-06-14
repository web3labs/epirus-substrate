import { Popover } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { FilterIcon } from "@heroicons/react/solid"
import { DateRangeInput, FocusedInput, OnDatesChangeProps } from "@datepicker-react/styled"
import React, { useReducer } from "react"
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

const initialState = {
  startDate: null,
  endDate: null,
  focusedInput: null
}

interface Action { type: string, payload: FocusedInput | OnDatesChangeProps}

function reducer (state : OnDatesChangeProps, action : Action) : OnDatesChangeProps {
  switch (action.type) {
  case "focusChange":
    return { ...state, focusedInput: action.payload as FocusedInput }
  case "dateChange":
    return action.payload as OnDatesChangeProps
  default:
    throw new Error()
  }
}

export function ListHeader ({ title, description }: {title:string, description?: string}) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="flex flex-col w-full p-4 border-b px-4 py-5 sm:px-6">
      <div className="flex flex-row">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        <div className="flex ml-auto">
          <Popover className="relative z-10">
            <Popover.Button
              className="group border py-1 px-2 inline-flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <span>Filter</span>
              <FilterIcon width={18} height={18}
                aria-hidden="true"
              />
            </Popover.Button>
            <Popover.Panel className="absolute z-10 top-0 transform right-0">
              {({ close }) => (
                <div className="bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="flex flex-row w-full items-start justify-between">
                    <h3 className="py-2 px-3">Filter</h3>
                    <Popover.Button className="p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                  <div className="relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8">
                    <DateRangeInput
                      onDatesChange={data => dispatch({ type: "dateChange", payload: data })}
                      onFocusChange={focusedInput => dispatch({ type: "focusChange", payload: focusedInput })}
                      startDate={state.startDate} // Date or null
                      endDate={state.endDate} // Date or null
                      focusedInput={state.focusedInput} // START_DATE, END_DATE or null
                    />
                  </div>
                </div>
              )}
            </Popover.Panel>
          </Popover>
        </div>
      </div>
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
