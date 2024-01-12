import React from "react"
import { shortDate } from "../../formats/time"
import { LightBlock } from "../../types/blocks"
import BlockLink from "./BlockLink"
import Lane from "../commons/Lane"
import { Row, TypedRow } from "../commons/List"
import { Label } from "../commons/Label"
import { NavLink } from "react-router-dom"

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
      >
        <div>
          <div className="flex gap-2 text-sm">
            <Label>Id:</Label>
            <Label >{obj.id}</Label>
            <Label>Hash:</Label>
            <Label >{obj.hash}</Label>
          </div>
          <div className="flex gap-2 text-sm">
            <Label>Events:</Label>
            <Label><NavLink to={`/blocks/${obj.hash}/events`} className="link">{obj.events ? obj.events.length : 0}</NavLink></Label>
            <Label>Extrinsics:</Label>
            <Label><NavLink to={`/blocks/${obj.hash}`} className="link">{obj.extrinsics ? obj.extrinsics.length : 0}</NavLink></Label>
          </div>
        </div>
      </Lane>
    </Row>
  )
}
