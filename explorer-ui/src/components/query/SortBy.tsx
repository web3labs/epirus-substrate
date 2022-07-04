import React from "react"
import { PageQuery } from "../../types/pagination"
import Select, { Option } from "./Select"

interface Props {
    options: Option[],
    pageQuery: PageQuery,
    setQuery: (pageQuery: PageQuery) => void,
    className?: string
}

export default function SortBy (
  { options, pageQuery, setQuery, className = "w-40" }
  : Props
) {
  return (<Select
    className={className}
    options={options}
    selected={options.find(opt => opt.value === pageQuery.orderBy)}
    onChange={option => {
      setQuery(Object.assign(
        {},
        pageQuery,
        { orderBy: option.value }
      ))
    }}
  />)
}
