import React, { ReactNode } from "react"

type NodeType =JSX.Element | string | number | null | undefined

export default function Lane ({
  children,
  head,
  tail,
  isCol = true
}: {
    children?: ReactNode
    head?: NodeType
    tail?: NodeType
    isCol?: boolean
}) {
  return (
    <div className="flex flex-wrap justify-between gap-4 items-start w-full md:gap-10">
      <div className="flex shrink">
        {head}
      </div>
      <div className={`flex grow ${isCol ? "flex-col" : ""} flex-wrap gap-2`}>
        {children}
      </div>
      <div className="flex shrink">
        {tail}
      </div>
    </div>
  )
}
