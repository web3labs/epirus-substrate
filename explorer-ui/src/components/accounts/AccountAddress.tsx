import Identicon from "@polkadot/react-identicon"
import React from "react"

import { shorten } from "../../formats/text"
import { classNames } from "../../utils/strings"
import { Default, Mobile } from "../responsive/Media"

interface Props {
  address: string,
  short?: boolean,
  children?: JSX.Element | null
  className?: string,
  size?: number
}

export default function AccountAddress ({
  address,
  short = false,
  children,
  className = "",
  size = 32
}: Props) {
  if (address) {
    return (
      <div className={
        classNames(
          "flex flex-wrap items-center gap-x-2",
          className
        )}>
        <div className="relative">
          <Identicon
            value={address}
            size={size}
            theme="polkadot"
          />
          {children}
        </div>
        <Mobile>
          <div className="font-mono overflow-hidden text-ellipsis">
            {shorten(address)}
          </div>
        </Mobile>
        <Default>
          <div className="font-mono overflow-hidden text-ellipsis">
            {short ? shorten(address) : address}
          </div>
        </Default>
      </div>
    )
  } else {
    return null
  }
}
