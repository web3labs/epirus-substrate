import React from "react"
import { formatDate } from "../../formats/time"
import { Event } from "../../types/contracts"
import { Row, TypedRow } from "../List"

export default function EventRow ({
  obj,
  currentId,
  short = false
}: TypedRow<Event>) {
  const { id, createdAt, data, extrinsic } = obj

  return (
    <Row key={id}>
      <div className="flex flex-row flex-wrap w-full text-sm overflow-hidden justify-between">
        <div className="flex flex-col flex-wrap gap-2 overflow-hidden">
          <div className="flex flex-col flex-wrap gap-2 md:flex-row overflow-hidden w-full">
            <div className="text-gray-400 text-sm">Contract emitted</div>
            <div className="font-mono text-ellipsis overflow-hidden w-full">{data}</div>
          </div>
          <div className="flex flex-col flex-wrap overflow-hidden gap-2 md:flex-row">
            <div className="text-gray-400 text-sm">On extrinsic</div>
            <div className="font-mono">{extrinsic.id}</div>
            <div className="text-gray-400 text-sm">of type</div>
            <div className="font-mono">{extrinsic.name}</div>
          </div>
        </div>
        <div className="flex ml-auto justify-end">{formatDate(createdAt)}</div>
      </div>
    </Row>
  )
}
