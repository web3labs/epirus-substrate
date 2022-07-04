import React, { useState } from "react"
import { FilterProps, mergeFilterQuery, resetFilterQuery } from "../Filters"
import Chip from "./Chip"

export function filterOf (
  { label, selector, template, placeholder = "" } :{
  label: string,
  selector: string,
  template: (value : string) => any,
  placeholder?: string
}) {
  // eslint-disable-next-line react/display-name
  return (props: any) => <TextFilter
    label={label}
    selector={selector}
    template={template}
    placeholder={placeholder}
    {...props}
  />
}

interface Props extends FilterProps {
  label:string,
  selector: string,
  template: (value : string) => any,
  placeholder?: string
}

export default function TextFilter ({
  filterQuery,
  setFilterQuery,
  label,
  selector,
  placeholder,
  template
} : Props) {
  const { applieds } = filterQuery
  const initialState = applieds[selector]?.data || ""
  const [value, setValue] = useState<string>(initialState)

  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-sm">{label}</h3>
      <input
        className="input w-full"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={event => {
          // Reset filter
          const cleanFilterQuery = resetFilterQuery({
            current: filterQuery,
            condition: entry => entry[selector] === undefined
          })

          // Update filter
          const data = event.target.value

          setFilterQuery(mergeFilterQuery(
            {
              current: cleanFilterQuery,
              clauses: template(data),
              applied: {
                [selector]: {
                  chip: <Chip key={`chip-${selector}`} label={label}/>,
                  data
                }
              }
            }
          ))

          setValue(data)
        }
        } />
    </div>
  )
}
