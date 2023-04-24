import React from "react"
import { NavLink } from "react-router-dom"
import { LightExtrinsic } from "../../types/extrinsic"
// import CodeBadge from "../badges/CodeBadge"
import ExtrinsicId from "./ExtrinsicId"

export default function ExtrinsicLink ({
  extrinsic,
  currentId,
  className = "",
  short
}: {
  extrinsic: LightExtrinsic;
  currentId?: string;
  className?: string;
  short?: boolean;
}) {
  // eslint-disable-next-line no-unused-vars
  const { id, ..._ } = extrinsic
  // const badgeSize = size ? size / 3 + 2 : undefined

  if (id === currentId) {
    return (
      <ExtrinsicId
        extrinsicId={String(id)}
        short={short}
        className={className}
      />
    )
  }

  return (
    <NavLink to={`/extrinsic/${id}`} className="link">
      <ExtrinsicId
        extrinsicId={String(id)}
        short={short}
        className={className}
      />
    </NavLink>
  )
}
