import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/solid"
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
      <div className="flex flex-row cursor-pointer -ml-1" onClick={() => setOpen(!open)}>
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
      {open && children}
    </div>
  )
}
