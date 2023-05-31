import { HomeIcon } from "@heroicons/react/24/solid"
import React from "react"

export default function HomeBadge ({ size = 12 }: {size?: number}) {
  return (
    <HomeIcon width={size} height={size} className="text-gray-700" />
  )
}
