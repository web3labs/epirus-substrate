import React, { Fragment } from "react"
import { Popover, Transition } from "@headlessui/react"
import {
  DocumentReportIcon,
  MenuIcon,
  UserIcon,
  XIcon
} from "@heroicons/react/outline"
import { ChevronDownIcon, CodeIcon } from "@heroicons/react/solid"

import Logo from "../logo.svg"
import SearchBox from "./SearchBox"
import { Link, NavLink } from "react-router-dom"
import { classNames } from "../utils/strings"
import { useChainProperties } from "../contexts/ChainContext"

const blockchain = [
  {
    name: "Accounts",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    to: "/accounts",
    icon: UserIcon
  },
  {
    name: "Contracts",
    description: "Pellentesque auctor vehicula justo vitae consectetur.",
    to: "/contracts",
    icon: DocumentReportIcon
  },
  {
    name: "Codes",
    description: "Mauris euismod feugiat eros eget mollis.",
    to: "/codes",
    icon: CodeIcon
  }
]

export default function Nav () {
  const { name } = useChainProperties()

  return (
    <Popover className="relative z-10">
      <div className="w-full md:flex justify-start items-center md:mb-2">
        <Popover.Group as="nav" className="flex w-full flex-wrap">
          <div className="flex flex-col md:flex-row md:justify-between items-center md:space-x-10 w-full md:mb-2">
            <div className="flex flex-row justify-start w-full px-4 md:px-0">
              <Link to="/">
                <span className="sr-only">Epirus</span>
                <img
                  className="h-8 w-auto sm:h-10"
                  src={Logo}
                  alt=""
                />
              </Link>
              <div className="-mr-2 -my-2 md:hidden ml-auto">
                <Popover.Button className="bg-white p-2 inline-flex items-center justify-center text-gray-600 focus:outline-none">
                  <span className="sr-only">Open menu</span>
                  <MenuIcon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
            </div>
            <div className="w-full mt-4 md:w-[40em] md:ml-auto">
              <SearchBox />
            </div>
          </div>
          <div className="hidden md:flex space-x-10 items-center justify-end w-full">
            <div className="mr-auto">
              <span className="bg-purple-100 text-purple-800 text-xs mr-2 px-1.5 py-1 rounded dark:bg-purple-200 dark:text-purple-900">
                {name}
              </span>
            </div>

            <NavLink to="/" className={({ isActive }) =>
              isActive ? "text-sm text-gray-900 underline" : "text-sm text-gray-600 hover:text-gray-900"
            }>
              Home
            </NavLink>

            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className="group inline-flex items-center text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
                  >
                    <span>Blockchain</span>
                    <ChevronDownIcon
                      className={classNames(
                        open ? "text-gray-600" : "text-gray-400",
                        "ml-2 h-5 w-5 group-hover:text-gray-500"
                      )}
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                      {({ close }) => (
                        <div className="shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                          <div className="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                            {blockchain.map((item) => (
                              <NavLink
                                key={item.name}
                                to={item.to}
                                onClick={() => close()}
                                className="-m-3 p-3 flex items-start hover:bg-gray-50"
                              >
                                <item.icon className="flex-shrink-0 h-6 w-6 text-purple-600" aria-hidden="true" />
                                <div className="ml-4">
                                  <p className="text-base font-medium text-gray-900">{item.name}</p>
                                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                </div>
                              </NavLink>
                            ))}
                          </div>
                        </div>
                      )}
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>

            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Tokens
            </a>
          </div>
        </Popover.Group>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel focus className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          {({ close }) => (
            <div className="shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <img
                      className="h-8 w-auto sm:h-10"
                      src={Logo}
                      alt=""
                    />
                  </div>
                  <div className="-mr-2">
                    <Popover.Button className="bg-white p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                      <span className="sr-only">Close menu</span>
                      <XIcon className="h-6 w-6" aria-hidden="true" />
                    </Popover.Button>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="block text-base font-medium mb-4">
                  Blockchain
                  </div>
                  <nav className="grid gap-y-8">
                    {blockchain.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className="-m-3 p-3 flex items-center hover:bg-gray-50"
                      >
                        <item.icon className="flex-shrink-0 h-6 w-6 text-purple-600" aria-hidden="true" />
                        <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">
                  Tokens
                  </a>
                </div>
              </div>
            </div>
          )}
        </Popover.Panel>
      </Transition>

    </Popover>
  )
}
