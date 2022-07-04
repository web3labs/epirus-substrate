import React from "react"

export default function Chip ({ label }
    : {label: string }
) {
  return (
    <span
      className="
        px-2
        py-1
        rounded
        text-gray-400
        border
        border-gray-200
        text-xs
        flex
        items-center
        align-center
        w-max
        capitalize
        cursor-pointer
        hover:border-blue-400
        hover:bg-blue-100
        ">
      {label}
    </span>
  )
}
