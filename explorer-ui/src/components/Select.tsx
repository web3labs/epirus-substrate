import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline"
import React, { Fragment, useEffect, useRef, useState } from "react"
import { classNames } from "../utils/strings"

export interface Option {
  name:string
  value:string
}

interface Props {
  options: Option[],
  selected?: Option,
  className?: string,
  onChange: (option: Option) => void
}

export default function Select (
  {
    options,
    className = "",
    selected,
    onChange
  }
  : Props) {
  const isInitialMount = useRef(true)
  const [selectedOption, setSelectedOption] = useState(selected)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else if (selectedOption !== undefined) {
      // emit only on updates
      onChange(selectedOption)
    }
  }, [selectedOption])

  return (
    <Listbox value={selectedOption} onChange={setSelectedOption}>
      <div className="relative">
        <Listbox.Button className={classNames(className,
          "relative cursor-default py-1 border pl-3 pr-10 text-left focus:outline-none")}>
          <span className="block truncate">{selectedOption?.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 max-h-60 w-full overflow-auto bg-white text-base ring-1 ring-black ring-opacity-5 focus:outline-none">
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-purple-100 text-purple-900" : "text-gray-900"
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.name}
                    </span>
                    {selected
                      ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-purple-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )
                      : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
