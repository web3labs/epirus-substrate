import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid"
import React, { useState } from "react"
import { classNames } from "../../utils/strings"

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
        <h3 className="font-medium mb-1">
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
      <div role="switch" className="group flex flex-row cursor-pointer -ml-1 items-center" onClick={() => setOpen(!open)}>
        {title &&
        <h3 className="tracking-wider text-sm">
          {title}
        </h3>
        }
        {open
          ? <ChevronUpIcon
            className="chevron text-gray-400 w-4 h-4 ml-2 group-hover:text-gray-600"
            aria-hidden="true"
          />
          : <ChevronDownIcon
            className="chevron text-gray-400 w-4 h-4 ml-2 group-hover:text-gray-600"
            aria-hidden="true"
          />
        }
      </div>
      {open && children}
    </div>
  )
}
