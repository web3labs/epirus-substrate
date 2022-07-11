import React, { Fragment, useCallback, useEffect, useState } from "react"
import { debounce } from "debounce"

import useSquid from "../../hooks/useSquid"
import { sanitize } from "../../utils/strings"
import { Transition } from "@headlessui/react"
import Loading from "../loading/Loading"

const QUERY = `
query($str: ID!, $limit: Int = 5) {
  contracts(where: { id_startsWith: $str }, limit: $limit) {
    id
  }
  accounts(where: { id_startsWith: $str }, limit: $limit) {
    id
  }
  contractCodes(where: { id_startsWith: $str }, limit: $limit) {
    id
  }
}
`

export default function SearchBox () {
  const [searchInput, setSearchInput] = useState("")
  const [searchStr, setSearchStr] = useState("")
  const [result] = useSquid({
    query: QUERY,
    variables: { str: searchStr },
    pause: searchStr.length < 5
  })

  const deboSearch = useCallback(debounce(setSearchStr, 1500), [])

  useEffect(() => {
    if (searchInput.length > 4) {
      deboSearch(searchInput)
    }
  }, [searchInput])

  const { fetching, data } = result

  return (
    <div>
      <form className="search">
        <div className="relative w-full">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5"
              fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input type="search"
            id="default-search"
            className="input w-full pl-10 text-sm"
            placeholder="Search Accounts, Contracts, ..."
            value={searchInput}
            onChange={event => {
              const str = sanitize(event.target.value)
              setSearchInput(str)
            }}
            required />
        </div>
      </form>
      <div className="relative">
        <Transition
          as={Fragment}
          show={true}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <div className="
            absolute
            z-10
            mt-0
            bg-white
            transform
            px-2
            max-w-md
            opacity-100
            shadow
            translate-y-0">
            {fetching
              ? <Loading />
              : JSON.stringify(data, null, 4)}
          </div>
        </Transition>
      </div>
    </div>
  )
}
