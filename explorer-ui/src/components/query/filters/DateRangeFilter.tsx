import React, { useReducer } from "react"
import { DateRangeInput, FocusedInput, OnDatesChangeProps } from "@datepicker-react/styled"
import { FilterProps } from "../Filters"
import Chip from "./Chip"

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

export default function DateRangeFilter ({
  filterQuery,
  setFilterQuery
} : FilterProps) {
  const initialState = filterQuery.dateRange?.data || {
    startDate: null,
    endDate: null,
    focusedInput: null
  }
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-sm">Date Range</h3>
      <DateRangeInput
        onDatesChange={data => {
          const { startDate, endDate } = data
          const clauses : Record<string, string> = {}

          if (startDate === null || endDate === null) {
            delete filterQuery.dateRange
            setFilterQuery({ ...filterQuery })
          } else {
            clauses.createdAt_gt = startDate.toISOString()
            clauses.createdAt_lt = endDate.toISOString()

            setFilterQuery({
              ...filterQuery,
              dateRange: {
                chip: <Chip key="chip-date_range"
                  label="Date Range"
                />,
                data,
                clauses
              }
            })
          }

          return dispatch({ type: "dateChange", payload: data })
        }}
        onFocusChange={focusedInput => dispatch({ type: "focusChange", payload: focusedInput })}
        startDate={state.startDate}
        endDate={state.endDate}
        focusedInput={state.focusedInput}
      />
    </div>
  )
}
