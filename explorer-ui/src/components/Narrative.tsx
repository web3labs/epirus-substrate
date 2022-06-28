import React from "react"
import { classNames } from "../utils/strings"

type Segment = Record<string, JSX.Element | string | null | undefined>

export default function Narrative ({
  id,
  full = true,
  segments
}: {
    id: string,
    segments: Segment | Segment[],
    full?: boolean
}) {
  const rows = []
  const mergedSegments = Array.isArray(segments) ? Object.assign({}, ...segments) : segments

  for (const key in mergedSegments) {
    const value = mergedSegments[key]
    const k = `${id}-${key}`
    if (value) {
      switch (key) {
      case "_":
        break
      /* placeholder for other transformations */
      default:
        rows.push(<span key={k} className="text-gray-400">{key}</span>)
      }

      rows.push(<span key={`${k}-value`}>{value}</span>)
    }
  }
  return (
    <div className={classNames(
      "flex flex-row flex-wrap gap-2 items-center text-sm",
      full ? "w-full" : ""
    )}>
      {rows}
    </div>
  )
}
