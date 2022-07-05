import React from "react"
import { PageQuery } from "../../types/pagination"
import Select, { Option } from "../commons/Select"

interface Props {
    options: Option[],
    pageQuery: PageQuery,
    setQuery: (pageQuery: PageQuery) => void,
    className?: string
}

export default function SortBy (
  { options, pageQuery, setQuery, className = "inline" }
  : Props
) {
  return (<Select
    className={className}
    options={options}
    title="Sort by"
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
