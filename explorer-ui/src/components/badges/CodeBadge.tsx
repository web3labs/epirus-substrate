import { CodeIcon } from "@heroicons/react/solid"
import React from "react"

export default function CodeBadge () {
  return (
    <span className="absolute -top-1 -left-1.5 bg-lime-200 rounded-full p-0.5 border border-white">
      <CodeIcon width={12} height={12} />
    </span>
  )
}
