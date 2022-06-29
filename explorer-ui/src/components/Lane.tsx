import React, { ReactNode } from "react"

type NodeType =JSX.Element | string | number | null | undefined

export default function Lane ({
  children,
  head,
  tail
}: {
    children?: ReactNode
    head?: NodeType
    tail?: NodeType
}) {
  return (
    <div className="grid grid-flow-col gap-2 items-start w-full">
      {head}
      <div className="flex flex-col flex-wrap gap-2 text-sm">
        {children}
      </div>
      <div className="flex text-sm">
        {tail}
      </div>
    </div>
  )
}
