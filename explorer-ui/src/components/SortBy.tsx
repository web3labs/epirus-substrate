import React from "react"
import { PageQuery } from "../types/pagination"
import Select, { Option } from "./Select"

interface Props {
    options: Option[],
    query: PageQuery,
    setQuery: (query: PageQuery) => void,
    className?: string
}

export default function SortBy (
  { options, query, setQuery, className = "w-40" }
  : Props
) {
  return (<Select
    className={className}
    options={options}
    selected={options[0]}
    onChange={option => {
      setQuery(Object.assign(
        {},
        query,
        { orderBy: option.value }
      ))
    }}
  />)
}
