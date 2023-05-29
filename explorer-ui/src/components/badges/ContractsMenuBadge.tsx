import { DocumentTextIcon } from "@heroicons/react/24/solid"
import React from "react"

export default function ContractsMenuBadge ({ size = 12 }: {size?: number}) {
  return (
    <DocumentTextIcon width={size} height={size} className="text-gray-700" />
  )
}
