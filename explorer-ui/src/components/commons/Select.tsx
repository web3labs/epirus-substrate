import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon } from "@heroicons/react/24/outline"
import { ChevronUpDownIcon } from "@heroicons/react/24/solid"
import React, { Fragment, useEffect, useRef, useState } from "react"
import { classNames } from "../../utils/strings"
import { Default, Mobile } from "../responsive/Media"

export interface Option {
  name:string
  value:string
}

interface Props {
  options: Option[],
  selected?: Option,
  className?: string,
  title?: string,
  onChange: (option: Option) => void
}

export default function Select (
  {
    options,
    className = "",
    title,
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
      <div className="md:relative flex flex-col items-stretch">
        <Listbox.Button className={classNames(className,
          "group select relative cursor-pointer px-2 py-1 pr-6 text-left items-center hover:bg-gray-100 hover:rounded"
        )}>
          <span className={`block truncate capitalize font-medium ${selectedOption === undefined && "text-gray-400"}`}>
            {selectedOption?.name || title || "select"}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            <ChevronUpDownIcon
              className="text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
              width={16}
              height={16}
            />
          </span>
        </Listbox.Button>
        <Default>
          <Listbox.Options className="absolute z-10 top-0 right-0
          transform w-60 max-h-60 bg-white shadow-lg ring-1
          ring-black ring-opacity-5 overflow-hidden">
            {title &&
              <div className="font-semibold select-none py-2 px-4">
                {title}
              </div>
            }
            {options.map((option, i) => (
              <Listbox.Option
                key={i}
                className={({ active }) =>
                  `select-option relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "active" : "text-gray-900"
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block capitalize ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.name}
                    </span>
                    {selected
                      ? (
                        <span className="selected absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )
                      : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Default>
        <Mobile>
          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Listbox.Options className="absolute z-10 top-0 left-0 inset-x-0 p-2 transition transform origin-top-right
            max-w-screen max-h-screen bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
              {title &&
              <div className="font-semibold select-none py-2 px-4">
                {title}
              </div>
              }
              {options.map((option, i) => (
                <Listbox.Option
                  key={i}
                  className={({ active }) =>
                    `select-option relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "active" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block capitalize ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      {selected
                        ? (
                          <span className="selected absolute inset-y-0 left-0 flex items-center pl-3">
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
        </Mobile>
      </div>
    </Listbox>
  )
}
