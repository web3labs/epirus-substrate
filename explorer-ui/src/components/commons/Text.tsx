import React from "react"
import { textSpans, shortenHexString } from "../../formats/text"
import { formatUnits } from "../../formats/units"
import { TokenProps } from "../../types/chain"
import { Default, Mobile } from "../responsive/Media"

export function HexText ({ short, children }:{short?: boolean, children: string | undefined}) {
  if (children === undefined) {
    return null
  }

  return (
    <div className="font-mono break-all">
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
    <div className="flex flex-col font-mono">
      <span>
        {selector}
      </span>
      <HexText short={short}>{args}</HexText>
    </div>
  )
}

export function AddressText ({ address, short = true }: {address?: string, short?: boolean}) {
  if (!short) {
    return <span className="font-mono">{address}</span>
  }

  const segs = textSpans(address)

  if (segs.length !== 5) {
    return <span className="font-mono">{address}</span>
  }

  return (
    <span className="flex gap-x-1 font-mono">
      <span className="address-g1">{segs[0]}</span>
      <span className="address-g2">{segs[1]}</span>
      <span className="address-ellipsis">{segs[2]}</span>
      <span className="address-g3">{segs[3]}</span>
      <span className="address-g4">{segs[4]}</span>
    </span>
  )
}

export function AccountUnit ({
  amount,
  token
}: { amount?: string | number | null, token: TokenProps }) {
  if (amount === null) {
    return null
  }

  return (
    <span className="font-mono">
      {formatUnits(amount, token)}
    </span>
  )
}
