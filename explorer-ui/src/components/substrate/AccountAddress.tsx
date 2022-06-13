import Identicon from "@polkadot/react-identicon"
import React from "react"
import { shorten } from "../../formats/text"

interface Props {
  address: string,
  short?: boolean,
  children?: JSX.Element | null
}

export default function AccountAddress ({ address, short = true, children }: Props) {
  if (address) {
    return (
      <div className="flex flex-wrap items-center">
        <div className="relative">
          <Identicon
            value={address}
            size={32}
            theme="polkadot"
          />
          {children}
        </div>
        <div className="text-sm ml-2">{short ? shorten(address) : address}</div>
      </div>
    )
  } else {
    return null
  }
}
