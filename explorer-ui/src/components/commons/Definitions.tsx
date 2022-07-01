import React, { ReactNode } from "react"
import { classNames } from "../../utils/strings"

export function DefinitionList ({ children } :{ children: ReactNode}) {
  return (<dl className="flex flex-col w-full gap-y-2 overflow-hidden text-ellipsis">
    {children}
  </dl>)
}

export function Definition ({ label, term, className = "" }: {
    label: string, term: JSX.Element | string | undefined | null, className?: string
  }) {
  if (term === undefined || term === null) {
    return null
  }

  return (
    <div className={classNames(className, "flex flex-row flex-wrap gap-x-2 items-start")}>
      <dt className="flex text-sm text-gray-400 basis-20">{label}</dt>
      <dd className="text-sm text-gray-900">{term}</dd>
    </div>
  )
}
