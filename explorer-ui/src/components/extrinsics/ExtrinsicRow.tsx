import React from "react"
// import { shortDate } from "../../formats/time"
import Lane from "../commons/Lane"
import { Row, TypedRow } from "../commons/List"
// import CodeLink from "../codes/CodeLink
import { Label } from "../commons/Label"
import { Extrinsic } from "../../types/extrinsic"
import { shortDate } from "../../formats/time"

export default function ExtrinsicRow ({
  obj,
  currentId,
  short = true
}: TypedRow<Extrinsic>) {
  return (
    <Row key={String(obj.id)}>
      <Lane
        head={
          <div className="flex flex-col gap-1">
            <Label className="text-xs">{obj.id}</Label>
          </div>
        }
      >
        <div className="flex gap-2 text-sm">
          <Label>Hash {obj.hash}</Label>
        </div>
        <div className="flex gap-2 text-sm">
          <Label>Time {shortDate(obj.createdAt)}</Label>
        </div>
        <div className="flex gap-2 text-sm">
          <Label>Result {obj.success ? "Success" : "Fail"}</Label>
        </div>
      </Lane>
    </Row>
  )
}
