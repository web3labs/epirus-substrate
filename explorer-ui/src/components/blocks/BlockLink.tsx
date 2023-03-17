import React from "react"
import { NavLink } from "react-router-dom"
import { BlockRef } from "../../types/blocks"
import CodeBadge from "../badges/CodeBadge"
import BlockId from "./BlockId"

export default function BlockLink (
  { block, currentId, className = "", short, size }
  : {
    block: BlockRef
    currentId?: string,
    className?: string
    short?: boolean,
    size?: number
  }
) {
  const { id } = block
  const badgeSize = size ? (size / 3) + 2 : undefined

  if (id === currentId) {
    return (
      <BlockId
        blockId={id}
        short={short}
        className={className}
        size={size}
      >
        {<CodeBadge size={badgeSize}/>}
      </BlockId>
    )
  }

  return (
    <NavLink to={`/blocks/${id}`} className="link">
      <BlockId
        blockId={id}
        short={short}
        className={className}
        size={size}
      >
        {<CodeBadge size={badgeSize}/>}
      </BlockId>
    </NavLink>
  )
}
