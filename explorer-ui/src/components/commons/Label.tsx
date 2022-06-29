import React, { ReactNode } from "react"
import { classNames } from "../../utils/strings"

export function Label ({ children, className = "" }: {children: ReactNode, className?: string}) {
  return (
    <span className={classNames("text-gray-400", className)}>
      {children}
    </span>
  )
}
