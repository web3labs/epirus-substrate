import React, { useReducer } from "react"
import { DateRangeInput, FocusedInput, OnDatesChangeProps } from "@datepicker-react/styled"
import { FilterProps, mergeFilterQuery, resetFilterQuery } from "../Filters"
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
  const { applieds } = filterQuery
  const initialState = applieds.dateRange?.data || {
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
          // Reset filter
          const cleanFilterQuery = resetFilterQuery({
            current: filterQuery,
            condition: entry => (
              entry.createdAt_gt !== undefined ||
              entry.createdAt_lt !== undefined
            )
          })

          // Update filter changes
          const { startDate, endDate } = data
          const clauses : Record<string, string> = {}

          if (startDate) {
            clauses.createdAt_gt = startDate.toISOString()
          }
          if (endDate) {
            clauses.createdAt_lt = endDate.toISOString()
          }

          setFilterQuery(mergeFilterQuery(
            {
              current: cleanFilterQuery,
              clauses,
              applied: {
                dateRange: {
                  chip: <Chip key="chip-date_range"
                    label="Date Range"
                  />,
                  data
                }
              }
            }
          ))

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
