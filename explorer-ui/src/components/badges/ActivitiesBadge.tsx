import { ArrowTrendingUpIcon } from "@heroicons/react/24/solid"
import React from "react"

export default function ActivitiesBadge ({ size = 12 }: {size?: number}) {
  return (
    <ArrowTrendingUpIcon width={size} height={size} className="text-gray-700" />
  )
}
