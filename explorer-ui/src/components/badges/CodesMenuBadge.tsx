import { CodeBracketIcon } from "@heroicons/react/24/solid"
import React from "react"

export default function CodesMenuBadge ({ size = 12 }: {size?: number}) {
  return (
    <CodeBracketIcon width={size} height={size} className="text-gray-700" />
  )
}
