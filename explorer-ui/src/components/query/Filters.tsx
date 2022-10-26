import { Popover, Transition } from "@headlessui/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { ChevronUpDownIcon } from "@heroicons/react/24/solid"

import React, { Fragment, useEffect, useRef, useState } from "react"
import { PageQuery } from "../../types/pagination"
import { Default, Mobile } from "../responsive/Media"

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

function toChips (filterQuery: FilterQuery) {
  return (Object.keys(filterQuery).length === 0
    ? <span className="text-sm font-medium text-gray-400">Filter</span>
    : (Object.values(filterQuery) as unknown as FilterApplied[]).map(
      a => a.chip
    )
  )
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
  const [chips, setChips] = useState(toChips(filterQuery))
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

  function handleApply (event: { preventDefault: () => void }) {
    event.preventDefault()

    setQuery(buildPageQuery({
      filterQuery,
      pageQuery: pageQueryRef.current
    }))
    setChips(toChips(filterQuery))

    popButtonRef?.current?.click()
  }

  function handleReset () {
    setQuery(pageQueryRef.current)
    setFilterQuery({})
    setChips(toChips({}))

    popButtonRef?.current?.click()
  }

  const filters = (
    <form onSubmit={handleApply}>
      <div className="flex w-full justify-end">
        <Popover.Button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
          <span className="sr-only">Close menu</span>
          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
        </Popover.Button>
      </div>
      <div className="flex flex-col gap-y-4 mx-5">
        {components}
      </div>
      <div className="flex gap-x-4 mx-5 mt-4 py-4">
        <button type="submit" className="btn btn-primary">
            Apply Filters
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
            Reset All
        </button>
      </div>
    </form>
  )

  return (
    <Popover className="md:relative">
      <Popover.Button
        ref={popButtonRef}
        className="group hover:bg-gray-100 hover:rounded
          px-2 py-1 gap-x-1 inline-flex flex-wrap items-center focus:outline-none"
      >
        {chips}
        <ChevronUpDownIcon className="text-gray-400 group-hover:text-gray-500"
          width={16}
          height={16}
          aria-hidden="true"
        />
      </Popover.Button>
      <Default>
        <Popover.Panel className="absolute z-10 top-0 transform right-0">
          <div className="bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            {filters}
          </div>
        </Popover.Panel>
      </Default>
      <Mobile>
        <Transition
          as={Fragment}
          enter="duration-200 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-100 ease-in"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Popover.Panel className="absolute z-10 top-0 left-0 inset-x-0 transition transform origin-top-right max-w-screen max-h-screen">
            <div className="bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              {filters}
            </div>
          </Popover.Panel>
        </Transition>
      </Mobile>
    </Popover>
  )
}
