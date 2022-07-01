import React, { useState } from "react"
import { FilterProps, mergeFilterQuery } from "../Filters"
import Chip from "./Chip"

export function filterOf (label: string, template: (value : string) => any) {
  // eslint-disable-next-line react/display-name
  return (props: any) => <TextFilter label={label} template={template} {...props} />
}

interface Props extends FilterProps {
  label: string,
  template: (value : string) => any
}

export default function TextFilter ({
  filterQuery,
  refresh,
  label,
  template
} : Props) {
  const { applieds } = filterQuery.current
  const initialState = applieds.address?.data || ""
  const [address, setAddress] = useState<string>(initialState)

  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-sm">From</h3>
      <input
        className="input w-full"
        type="text"
        placeholder="Address..."
        value={address}
        onChange={event => {
          const data = event.target.value

          filterQuery.current = mergeFilterQuery(
            {
              current: filterQuery.current,
              clauses: template(data),
              applied: {
                [label]: {
                  chip: <Chip key={`chip-${label}`}
                    label={label}
                    onRemove={() => {
                      const filter = filterQuery.current
                      delete filter.applieds[label]
                      delete (filter.pageQuery?.where as any)[label]
                      refresh(filter)
                    }}
                  />,
                  data
                }
              }
            }
          )

          setAddress(data)
        }
        } />
    </div>
  )
}
