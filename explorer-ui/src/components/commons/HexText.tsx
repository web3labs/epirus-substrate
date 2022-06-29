import React from "react"
import { shortenHexString } from "../../formats/text"
import { Default, Mobile } from "../responsive/Media"

export default function HexText ({ short, children }:{short?: boolean, children: string | undefined}) {
  return (
    <>
      <Mobile>
        <div className="font-mono overflow-hidden text-ellipsis">
          {shortenHexString(children)}
        </div>
      </Mobile>
      <Default>
        <div className="font-mono overflow-hidden text-ellipsis">
          {short ? shortenHexString(children) : children}
        </div>
      </Default>
    </>
  )
}
