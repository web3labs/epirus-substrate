import React from "react"
// import { shortDate } from "../../formats/time"
import Lane from "../commons/Lane"
import { Row, TypedRow } from "../commons/List"
// import CodeLink from "../codes/CodeLink
import { Label } from "../commons/Label"
import { LightExtrinsic } from "../../types/extrinsic"
import ExtrinsicLink from "./ExtrinsicLink"
// import { shortDate } from "../../formats/time"
import CheckBadge from "../badges/CheckBadge"
import CrossBadge from "../badges/CrossBadge"

export default function ExtrinsicRow ({
  obj,
  currentId,
  short = true
}: TypedRow<LightExtrinsic>) {
  return (
    <Row key={String(obj.id)}>
      <Lane
        head={
          <div className="flex gap-2 text-sm">
            <ExtrinsicLink extrinsic={obj} currentId={currentId} short={short} />
          </div>
        }
        isCol={false}
      >
        <div className="flex flex-col gap-1">
          <Label className="text-xs">{obj.hash}</Label>
        </div>
        <div className="flex gap-2 text-sm" style={{ display: "inline" }}>
          <Label>{obj.success ? <CheckBadge/> : <CrossBadge/>}</Label>
        </div>
      </Lane>
    </Row>
  )
}
