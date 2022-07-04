import { Popover } from "@headlessui/react"
import { FilterIcon } from "@heroicons/react/solid"
import { XIcon } from "@heroicons/react/outline"

import React, { useEffect, useRef, useState } from "react"
import { PageQuery } from "../../types/pagination"

interface FilterApplied {
  data: any
  chip: JSX.Element
  clauses: any
}

export type FilterQuery = Record<string, FilterApplied>

export interface FilterProps {
  filterQuery: FilterQuery,
  setFilterQuery: (query: FilterQuery) => void,
  className?: string
}

function buildPageQuery ({ filterQuery, pageQuery }: {
  filterQuery: FilterQuery,
  pageQuery: PageQuery
}) {
  // Transform to AND query if needed
  const where = (pageQuery.where || {}) as unknown as any
  let andClauses = [] as any[]
  if (where.AND) {
    andClauses = where.AND
  } else {
    const entries = Object.entries(where).map(([k, v]) => ({ [k]: v }))
    if (entries.length > 0) {
      andClauses = andClauses.concat(entries)
    }
  }

  // Add filter clauses
  const filterClauses = Object.values(filterQuery)
    .flatMap(f => Object.entries(f.clauses)
      .map(([k, v] : any) => ({ [k]: v }))
    )
  andClauses = andClauses.concat(filterClauses)

  // Shallow copied page query
  return Object.assign({},
    pageQuery,
    {
      where: {
        AND: andClauses
      }
    }
  )
}

function withFilters <P extends object> (
  WrappedComponent : React.ComponentType<P>,
  key: string
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
  const [filterQuery, setFilterQuery] = useState<FilterQuery>({})
  const pageQueryRef = useRef<PageQuery>(pageQuery)
  const popButtonRef = useRef<HTMLButtonElement>(null)

  const props = filterProps
    ? { ...filterProps, filterQuery, setFilterQuery }
    : { filterQuery, setFilterQuery }
  const components = (Array.isArray(filterTypes)
    ? filterTypes.map((c, i) => withFilters(c, "f-" + i))
    : [withFilters(filterTypes, "f-0")])
    .map(c => c(props))

  // Handles updates from other places
  useEffect(() => {
    const currentPageQuery = pageQueryRef.current
    pageQueryRef.current = {
      ...currentPageQuery,
      orderBy: pageQuery.orderBy,
      first: pageQuery.first,
      after: pageQuery.after
    }
  }, [pageQuery])

  function handleApply () {
    setQuery(buildPageQuery({
      filterQuery,
      pageQuery: pageQueryRef.current
    }))

    popButtonRef?.current?.click()
  }

  function handleReset () {
    setQuery(pageQueryRef.current)
    setFilterQuery({})

    popButtonRef?.current?.click()
  }

  const filters = (
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
        <button className="btn btn-primary" onClick={handleApply}>
            Apply Filters
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
            Reset All
        </button>
      </div>
    </>
  )

  const chips = Object.keys(filterQuery).length === 0
    ? "Filters"
    : (Object.values(filterQuery) as unknown as FilterApplied[]).map(
      a => a.chip
    )

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
