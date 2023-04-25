import { XCircleIcon } from "@heroicons/react/24/solid"
import React from "react"

export default function CheckBadge ({ size = 12 }: {size?: number}) {
  return (
    <span className="absolute bg-red-200 rounded-full p-0.5 border border-white">
      <XCircleIcon width={size} height={size} className="text-gray-700" />
    </span>
  )
}
