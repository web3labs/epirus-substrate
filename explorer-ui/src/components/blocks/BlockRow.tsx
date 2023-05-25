import React from "react"
import { shortDate } from "../../formats/time"
import { LightBlock } from "../../types/blocks"
import BlockLink from "./BlockLink"
import Lane from "../commons/Lane"
import { Row, TypedRow } from "../commons/List"
// import CodeLink from "../codes/CodeLink
import { Label } from "../commons/Label"

export default function BlockRow ({
  obj,
  currentId,
  short = true
}: TypedRow<LightBlock>) {
  // eslint-disable-next-line no-unused-vars
  const { id, height, timestamp } = obj
  return (
    <Row key={String(obj.id)}>
      <Lane
        head={
          <div className="flex flex-col gap-1">
            <BlockLink block={obj} currentId={currentId} short={short} />
            <Label className="text-xs">{shortDate(timestamp)}</Label>
          </div>
        }
        tail={
          <div>
            <div className="flex gap-2 text-sm">
              <Label>Id:</Label>
              <Label >{obj.id}</Label>
            </div>
            <div className="flex gap-2 text-sm">
              <Label>Events:</Label>
              <Label >{obj.events ? obj.events.length : 0}</Label>
              <Label>Extrinsics:</Label>
              <Label >{obj.extrinsics ? obj.extrinsics.length : 0}</Label>
            </div>
          </div>
        }
      />
    </Row>
  )
}
