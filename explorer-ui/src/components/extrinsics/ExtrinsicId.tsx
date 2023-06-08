import React from "react"

import { classNames } from "../../utils/strings"
import { Default, Mobile } from "../responsive/Media"
import { AddressText } from "../commons/Text"

interface Props {
  extrinsicId: string;
  short?: boolean;
  className?: string;
}

export default function ExtrinsicId ({
  extrinsicId,
  short = true,
  className = ""
}: Props) {
  if (extrinsicId) {
    return (
      <div
        className={classNames("flex flex-wrap items-center gap-x-2", className)}
      >
        <Mobile>
          <div className="overflow-hidden text-ellipsis">
            <AddressText address={extrinsicId} />
          </div>
        </Mobile>
        <Default>
          <div className="overflow-hidden text-ellipsis">
            <AddressText address={extrinsicId} short={short} />
          </div>
        </Default>
      </div>
    )
  } else {
    return null
  }
}
