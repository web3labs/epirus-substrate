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
        border
        border-gray-200
        text-sm
        font-medium
        flex
        items-center
        align-center
        w-max
        capitalize
        cursor-pointer
        hover: border-gray-300
        ">
      {label}
    </span>
  )
}
