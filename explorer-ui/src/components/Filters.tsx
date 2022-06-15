import { Popover } from "@headlessui/react"
import { FilterIcon } from "@heroicons/react/solid"
import { XIcon } from "@heroicons/react/outline"
import { DateRangeInput, FocusedInput, OnDatesChangeProps } from "@datepicker-react/styled"

import React, { useReducer } from "react"

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

export default function Filters () {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <Popover className="relative">
      <Popover.Button
        className="border py-1 px-2 gap-x-1 inline-flex items-center text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <FilterIcon className="h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <span>Filters</span>
      </Popover.Button>
      <Popover.Panel className="absolute z-10 top-0 transform right-0">
        {({ close }) => (
          <div className="bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="flex w-full justify-end">
              <Popover.Button className="p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                <span className="sr-only">Close menu</span>
                <XIcon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
            <div className="relative grid gap-y-6 px-5 pb-3">
              <div>
                <h3 className="text-sm">Date Range</h3>
                <DateRangeInput
                  onDatesChange={data => dispatch({ type: "dateChange", payload: data })}
                  onFocusChange={focusedInput => dispatch({ type: "focusChange", payload: focusedInput })}
                  startDate={state.startDate} // Date or null
                  endDate={state.endDate} // Date or null
                  focusedInput={state.focusedInput} // START_DATE, END_DATE or null
                />
              </div>
              <div>
                <button>APPLY</button>
              </div>
            </div>
          </div>
        )}
      </Popover.Panel>
    </Popover>
  )
}
