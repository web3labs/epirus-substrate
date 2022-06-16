import { Transition } from "@headlessui/react"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid"
import React, { useState } from "react"
import { classNames } from "../utils/strings"

interface Props {
  children: JSX.Element[] | JSX.Element, title?: string, className?: string, isOpen?: boolean
  collapsable?: boolean
}

export default function Segment (props: Props) {
  if (props.collapsable) {
    return <CollapsableSegment {...props} />
  }

  const {
    children,
    title,
    className = ""
  } = props

  return (
    <div className={classNames(className, "flex flex-col w-full px-5 py-3 gap-y-2")}>
      {title &&
        <h3 className="small-caps mb-1">
          {title}
        </h3>
      }
      {children}
    </div>
  )
}

function CollapsableSegment ({
  children,
  title,
  className = "",
  isOpen = true
}: Props) {
  const [open, setOpen] = useState(isOpen)

  return (
    <div className={classNames(className, "flex flex-col w-full px-5 py-3 gap-y-2")}>
      <div className="flex flex-row cursor-pointer -ml-4" onClick={() => setOpen(!open)}>
        {open
          ? <ChevronDownIcon className="text-gray-400 w-4 h-4" />
          : <ChevronRightIcon className="text-gray-400 w-4 h-4"/>
        }
        {title &&
        <h3 className="uppercase tracking-wider text-xs mb-1">
          {title}
        </h3>
        }
      </div>
      <Transition
        show={open}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {children}
      </Transition>
    </div>
  )
}
