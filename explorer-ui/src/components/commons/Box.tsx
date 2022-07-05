import React from "react"
import { classNames } from "../../utils/strings"

interface BoxProps {
    children: JSX.Element | JSX.Element[],
    className?: string
}

interface HeadProps {
  title: JSX.Element | JSX.Element[],
  tag?: JSX.Element
}

export function BoxHead ({ title, tag }: HeadProps) {
  return (
    <div className="flex flex-row flex-wrap w-full items-start justify-between mb-2 mt-4 gap-x-2">
      <h3 className="mx-5 mb-2 font-medium">
        {title}
      </h3>
      <div className="flex flex-row flex-wrap gap-x-2 px-4">
        {tag}
      </div>
    </div>
  )
}

export default function Box ({ children, className = "" }: BoxProps) {
  return (
    <div className={classNames(
      "flex flex-col container w-full items-start justify-start bg-over shadow",
      className
    )}>
      {children}
    </div>
  )
}
