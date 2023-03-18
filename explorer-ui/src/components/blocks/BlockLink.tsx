import React from "react"
import { NavLink } from "react-router-dom"
import { LightBlock } from "../../types/blocks"
import CodeBadge from "../badges/CodeBadge"
import BlockId from "./BlockId"

export default function BlockLink (
  { block, currentId, className = "", short, size }
  : {
    block: LightBlock
    currentId?: string,
    className?: string
    short?: boolean,
    size?: number
  }
) {
  // eslint-disable-next-line no-unused-vars
  const { id, ..._ } = block
  const badgeSize = size ? (size / 3) + 2 : undefined

  if (id === currentId) {
    return (
      <BlockId
        blockId={String(id)}
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
        blockId={String(id)}
        short={short}
        className={className}
        size={size}
      >
        {<CodeBadge size={badgeSize}/>}
      </BlockId>
    </NavLink>
  )
}
