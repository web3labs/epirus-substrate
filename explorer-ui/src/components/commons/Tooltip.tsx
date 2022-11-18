import React from "react"

export default function Tooltip ({
  content,
  children
} : {
    content: string | React.ReactElement,
    children: string | React.ReactElement
}) {
  return <div className="flex items-center group">
    {children}
    <span className="absolute mx-5 p-2 text-xs text-gray-50 border rounded border-gray-700
               bg-gray-700 text-wrap max-w-xs invisible group-hover:visible"
    >
      {content}
    </span>
  </div>
}
