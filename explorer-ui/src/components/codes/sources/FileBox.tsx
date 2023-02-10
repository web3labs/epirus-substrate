import React from "react"

export default function FileBox ({
  name,
  tools,
  children
} : {
    name: string,
    tools?: React.ReactElement | React.ReactElement[],
    children: string | React.ReactElement | React.ReactElement[],
}) {
  return (
    <div className="my-2 border border-neutral-200 text-xs font-mono rounded-lg">
      <div className="p-2 flex justify-between items-center rounded-t-lg bg-neutral-50 border-b">
        <div className="ml-2">{name}</div>
        <div className="flex gap-1 items-center">
          {tools}
        </div>
      </div>
      <div className="p-2 flex flex-col gap-1">
        {children}
      </div>
    </div>
  )
}
