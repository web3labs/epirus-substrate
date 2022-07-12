import Identicon from "@polkadot/react-identicon"
import React from "react"

import { classNames } from "../../utils/strings"
import { Default, Mobile } from "../responsive/Media"
import { AddressText } from "../commons/Text"

interface Props {
  address: string,
  short?: boolean,
  children?: JSX.Element | null
  className?: string,
  size?: number
}

export default function AccountAddress ({
  address,
  short = true,
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
          <div className="overflow-hidden text-ellipsis">
            <AddressText address={address} />
          </div>
        </Mobile>
        <Default>
          <div className="overflow-hidden text-ellipsis">
            <AddressText address={address} short={short} />
          </div>
        </Default>
      </div>
    )
  } else {
    return null
  }
}
