import { CodeIcon } from "@heroicons/react/solid"
import React from "react"
import { classNames } from "../../utils/strings"
import { AddressText } from "../commons/Text"

export default function CodeHash ({
  hash,
  size = 16,
  className = "",
  short = true
}: {
  hash: string,
  size?: number,
  className?: string,
  short?: boolean
}) {
  const padding = size > 20 ? "p-1.5" : "p-0.5"
  return (
    <div className={classNames("flex gap-2 items-center text-sm", className)}>
      <span className={classNames("bg-lime-200 rounded-full", padding)}>
        <CodeIcon width={size} height={size} className="text-gray-700" />
      </span>
      <AddressText address={hash} short={short} />
    </div>
  )
}
