import { CodeBracketIcon } from "@heroicons/react/24/solid"
import React from "react"

export default function CodeBadge ({ size = 12 }: {size?: number}) {
  return (
    <span className="absolute -top-1 -left-1.5 bg-lime-200 rounded-full p-0.5 border border-white">
      <CodeBracketIcon width={size} height={size} className="text-gray-700" />
    </span>
  )
}
