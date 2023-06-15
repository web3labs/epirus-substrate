import Identicon from "@polkadot/react-identicon"
import React from "react"

import { classNames } from "../../utils/strings"
import { Default, Mobile } from "../responsive/Media"
import { AddressText } from "../commons/Text"

interface Props {
  blockId: string;
  short?: boolean;
  children?: JSX.Element | null;
  className?: string;
  size?: number;
  showBadge?: boolean;
}

export default function BlockId ({
  blockId,
  short = true,
  children,
  className = "",
  size = 32,
  showBadge = true
}: Props) {
  if (blockId) {
    return (
      <div
        className={classNames("flex flex-wrap items-center gap-x-2", className)}
      >
        <>{ showBadge &&
        <div className="relative">
          <Identicon value={blockId} size={size} theme="polkadot" />
          {children}
        </div>
        }</>
        <Mobile>
          <div className="overflow-hidden text-ellipsis">
            <AddressText address={blockId} />
          </div>
        </Mobile>
        <Default>
          <div className="overflow-hidden text-ellipsis">
            <AddressText address={blockId} short={short} />
          </div>
        </Default>
      </div>
    )
  } else {
    return null
  }
}
