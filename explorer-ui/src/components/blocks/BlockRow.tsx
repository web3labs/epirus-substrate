import React from "react"
import { shortDate } from "../../formats/time"
import { LightBlock } from "../../types/blocks"
import BlockLink from "./BlockLink"
import Lane from "../commons/Lane"
import { Row, TypedRow } from "../commons/List"
// import CodeLink from "../codes/CodeLink"
import { Label } from "../commons/Label"

export default function BlockRow ({
  obj,
  currentId,
  short = true
}: TypedRow<LightBlock>) {
  const { block, createdAt } = obj

  return (
    <Row key={block.id}>
      <Lane
        head={
          <div className="flex flex-col gap-1">
            <BlockLink block={block} currentId={currentId} short={short} />
            <Label className="text-xs">{shortDate(createdAt)}</Label>
          </div>
        }
      />
    </Row>
  )
}
