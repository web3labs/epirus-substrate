import React, { ReactNode } from "react"
import { classNames } from "../../utils/strings"

export function Label ({ children, className = "" }: {children: ReactNode, className?: string}) {
  return (
    <span className={classNames("text-light", className)}>
      {children}
    </span>
  )
}
