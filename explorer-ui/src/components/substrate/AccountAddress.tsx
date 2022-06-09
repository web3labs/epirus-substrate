import Identicon from "@polkadot/react-identicon"
import React from "react"
import { shorten } from "../../formats/text"

interface Props {
  address: string,
  badge?: JSX.Element
}

export default function AccountAddress ({ address, badge }: Props) {
  if (address) {
    return (
      <div className="flex flex-wrap items-center">
        <div className="relative">
          <Identicon
            value={address}
            size={32}
            theme="polkadot"
          />
          {badge}
        </div>
        <div className="text-sm ml-2">{shorten(address)}</div>
      </div>
    )
  } else {
    return null
  }
}
