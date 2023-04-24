import React from "react"
// import { shortDate } from "../../formats/time"
import Lane from "../commons/Lane"
import { Row, TypedRow } from "../commons/List"
// import CodeLink from "../codes/CodeLink
import { Label } from "../commons/Label"
import { LightExtrinsic } from "../../types/extrinsic"
// import { shortDate } from "../../formats/time"

export default function ExtrinsicRow ({
  obj,
  currentId,
  short = true
}: TypedRow<LightExtrinsic>) {
  return (
    <Row key={String(obj.id)}>
      <Lane
        head={
          <div className="flex flex-col gap-1">
            <Label className="text-xs">{obj.id}</Label>
          </div>
        }
        isCol={false}
      >
        <div className="flex gap-2 text-sm">
          <Label>{obj.hash}</Label>
        </div>
        <div className="flex gap-2 text-sm" style={{ display: "inline" }}>
          <Label>{obj.success ? "Success" : "Fail"}</Label>
        </div>
      </Lane>
    </Row>
  )
}
