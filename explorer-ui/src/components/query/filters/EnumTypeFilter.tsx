import React, { useState } from "react"
import { ActivityType } from "../../../types/contracts"
import { FilterProps } from "../Filters"
import Chip from "./Chip"
import { Listbox } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline"

export interface SelectionInput {
  label: string,
  value: string
}

export function enumTypeFilterOf (
  { label, selector, template, inputValues } :{
  label: string,
  selector: string,
  template: (value : string) => any,
  inputValues: SelectionInput[]
}) {
  return function EnumTypeFilterOf (props: any) {
    return (<EnumTypeFilter
      label={label}
      selector={selector}
      template={template}
      inputValues={inputValues}
      {...props}
    />)
  }
}

interface Props extends FilterProps {
  label:string,
  selector: string,
  inputValues: SelectionInput[],
  template: (value : string) => any,
}

export default function EnumTypeFilter ({
  filterQuery,
  setFilterQuery,
  label,
  selector,
  inputValues,
  template
} : Props) {
  const initialState = filterQuery[selector]?.data || inputValues[0]
  const [selected, setSelected] = useState<SelectionInput>(initialState)

  return (
    <div className="flex flex-col gap-y-2">
      <h3 className="text-sm">{label}</h3>
      <div>
        <Listbox value={selected} onChange={data => {
          if (data.value === undefined || data.value === "" || !Object.values<string>(ActivityType).includes(data.value)) {
            delete filterQuery[selector]
            setFilterQuery({ ...filterQuery })
          } else {
            setFilterQuery({
              ...filterQuery,
              [selector]: {
                chip: <Chip key={`chip-${selector}`} label={label}/>,
                clauses: template(data.value),
                data
              }
            })
          }

          setSelected(data)
        }}>
          <Listbox.Button className="input relative w-full cursor-default bg-white border border-gray-200 pt-3 pl-4 pr-10 text-left text-sm">
            <span className="block truncate">{selected.label}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Listbox.Options className="max-h-60 w-full overflow-auto bg-white border border-gray-200 text-base">
            {inputValues.map((input) => (
              <Listbox.Option
                key={`select-option-${input.value}`}
                value={input}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected }) => (
                  <>
                    <span className="text-sm">
                      {input.label}
                    </span>
                    {selected
                      ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )
                      : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    </div>
  )
}
