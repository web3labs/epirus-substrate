import React from "react"
import { NavLink } from "react-router-dom"
import { LightBlock } from "../../types/blocks"
import BlockBadge from "../badges/BlockBadge"
import BlockId from "./BlockId"

export default function BlockLink ({
  block,
  currentId,
  className = "",
  short,
  size,
  showBadge = true
}: {
  block: LightBlock;
  currentId?: String;
  className?: string;
  short?: boolean;
  size?: number;
  showBadge?: boolean;
}) {
  // eslint-disable-next-line no-unused-vars
  const { hash, height, ..._ } = block
  const badgeSize = size ? size / 3 + 2 : undefined

  /*
  if (id === currentId) {
    return (
      <BlockId
        blockId={String(height)}
        short={short}
        className={className}
        size={size}
      >
        {<BlockBadge size={badgeSize} />}
      </BlockId>
    )
  }
  */

  return (
    <NavLink to={`/blocks/${hash}`} className="link">
      <BlockId
        blockId={String(height)}
        short={short}
        className={className}
        size={size}
        showBadge={showBadge}
      >
        <>{ showBadge === true && <BlockBadge size={badgeSize} /> }</>
      </BlockId>
    </NavLink>
  )
}
