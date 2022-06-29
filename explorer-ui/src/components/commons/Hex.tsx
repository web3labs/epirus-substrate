import React from "react"
import { shortenHexString } from "../../formats/text"
import { Default, Mobile } from "../responsive/Media"

export function HexText ({ short, children }:{short?: boolean, children: string | undefined}) {
  if (children === undefined) {
    return null
  }

  return (
    <div className="font-mono overflow-hidden text-ellipsis">
      <Mobile>
        <span>{shortenHexString(children)}</span>
      </Mobile>
      <Default>
        <span>{short ? shortenHexString(children) : children}</span>
      </Default>
    </div>
  )
}

export function HexCallData ({ short, children }:{short?: boolean, children: string | undefined}) {
  if (children === undefined) {
    return null
  }

  const selector = children.slice(2, 14)
  const args = children.slice(14)

  return (
    <div className="flex font-mono">
      <span className="underline underline-offset-4 decoration-2 decoration-lime-500">0x{selector}</span><HexText short={short}>{args}</HexText>
    </div>
  )
}
