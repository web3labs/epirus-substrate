import { UserGroupIcon } from "@heroicons/react/24/solid"
import React from "react"

export default function AccountsBadge ({ size = 12 }: {size?: number}) {
  return (
    <UserGroupIcon width={size} height={size} className="text-gray-700" />
  )
}
