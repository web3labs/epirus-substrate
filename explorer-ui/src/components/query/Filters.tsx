import { Popover } from "@headlessui/react"
import { FilterIcon } from "@heroicons/react/solid"
import { XIcon } from "@heroicons/react/outline"

import React, { MutableRefObject, useMemo, useRef, useState } from "react"
import { PageQuery } from "../../types/pagination"

export interface FilterApplied {
  data: any,
  chip: JSX.Element
}

export interface FilterQuery {
  pageQuery: PageQuery,
  applieds: Record<string, FilterApplied>
}

export interface FilterProps {
  filterQuery: MutableRefObject<FilterQuery>,
  refresh: (updated: FilterQuery) => void,
  className?: string
}

export function mergeFilterQuery ({ current, clauses, applied }: {
  current: FilterQuery, clauses: Record<string, string>, applied: Record<string, any>
}) {
  const { pageQuery } = current
  return {
    applieds: {
      ...current.applieds,
      ...applied
    },
    pageQuery: Object.assign(
      {},
      pageQuery,
      {
        where: Object.assign({}, pageQuery.where || {}, clauses)
      }
    )
  }
}

function withFilters <P extends object> (
  WrappedComponent : React.ComponentType<P>,
  key: string,
  props : FilterProps
) {
  return function WithFilters (props : any) {
    return <WrappedComponent
      key={key}
      close={close}
      {...props}
    />
  }
}

export default function Filters ({
  filterTypes,
  pageQuery,
  setQuery,
  filterProps
} : {
  filterTypes: React.ComponentType<FilterProps> | React.ComponentType<FilterProps>[],
  setQuery: (pageQuery: PageQuery) => void,
  pageQuery: PageQuery,
  filterProps?: FilterProps
}) {
  const [forceUpdate, setForceUpdate] = useState(0)
  const filterQuery = useRef({ pageQuery, applieds: {} })
  const popButtonRef = useRef<HTMLButtonElement>(null)

  // XXX hack
  const refresh = (updated: FilterQuery) => {
    filterQuery.current = updated
    setForceUpdate(new Date().getTime())
    setQuery(filterQuery.current.pageQuery)
  }

  const filters = useMemo(() => {
    const props = filterProps
      ? { ...filterProps, filterQuery, refresh }
      : { filterQuery, refresh }
    const components = (Array.isArray(filterTypes)
      ? filterTypes.map((c, i) => withFilters(c, "f-" + i, props))
      : [withFilters(filterTypes, "f-0", props)])
      .map(c => c(props))

    function handleClick () {
      setQuery(filterQuery.current.pageQuery)
      popButtonRef?.current?.click()
    }
    return (
      <>
        <div className="flex w-full justify-end">
          <Popover.Button className="p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
            <span className="sr-only">Close menu</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </Popover.Button>
        </div>
        <div className="flex flex-col gap-y-4 mx-5">
          {components}
        </div>
        <div className="flex gap-x-4 mx-5 mt-4 py-4">
          <button className="btn btn-primary" onClick={handleClick}>
            Apply Filters
          </button>
          <button className="btn btn-secondary">
            Reset All
          </button>
        </div>
      </>
    )
  }, [filterQuery.current])

  const chips = useMemo(() => {
    const { applieds } = filterQuery.current
    return Object.keys(applieds).length === 0
      ? "Filters"
      : (Object.values(applieds) as unknown as FilterApplied[]).map(
        a => a.chip
      )
  }, [filterQuery.current, forceUpdate])

  return (
    <Popover className="relative">
      <Popover.Button
        ref={popButtonRef}
        className="py-2 px-3 gap-x-1 inline-flex flex-wrap items-center text-gray-600 hover:text-blue-500 focus:outline-none"
      >
        <FilterIcon className="h-5 w-5 text-gray-400 hover:text-blue-600"
          aria-hidden="true"
        />
        {chips}
      </Popover.Button>
      <Popover.Panel className="absolute z-10 top-0 transform right-0">
        <div className="bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          {filters}
        </div>
      </Popover.Panel>
    </Popover>
  )
}
