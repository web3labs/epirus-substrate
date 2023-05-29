import { Square3Stack3DIcon } from "@heroicons/react/24/solid"
import React from "react"

export default function BlocksMenuBadge ({ size = 12 }: {size?: number}) {
  return (
    <Square3Stack3DIcon width={size} height={size} className="text-gray-700" />
  )
}
