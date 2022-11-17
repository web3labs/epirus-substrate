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
  return (<div className="my-2 border border-neutral-200 text-xs font-mono">
    <div className="p-2 flex justify-between bg-neutral-100 items-center">
      <div>{name}</div>
      <div className="flex gap-1 items-center">
        {tools}
      </div>
    </div>
    <div className="p-2 flex flex-col gap-1 items-center">
      {children}
    </div>
  </div>)
}
