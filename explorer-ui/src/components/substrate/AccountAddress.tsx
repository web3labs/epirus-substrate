import Identicon from "@polkadot/react-identicon"
import React from "react"
import { shorten } from "../../formats/text"
import { con } from "../../utils/strings"

interface Props {
  address: string,
  short?: boolean,
  children?: JSX.Element | null
  className?: string
}

export default function AccountAddress ({ address, short = false, children, className }: Props) {
  if (address) {
    return (
      <div className={
        con(
          "flex flex-wrap items-center gap-x-2",
          className
        )}>
        <div className="relative">
          <Identicon
            value={address}
            size={32}
            theme="polkadot"
          />
          {children}
        </div>
        <div className="font-mono overflow-hidden text-ellipsis">{short ? shorten(address) : address}</div>
      </div>
    )
  } else {
    return null
  }
}
