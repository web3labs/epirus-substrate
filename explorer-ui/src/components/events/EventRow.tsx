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
      <div className="flex flex-col gap-2 max-w-[75%] text-sm">
        <div className="text-gray-400">Contract emitted</div>
        <div className="font-mono w-full break-words">{data}</div>
        <div className="flex flex-col gap-2 md:flex-row">
          <div className="text-gray-400">On extrinsic</div>
          <div className="font-mono">{extrinsic.id}</div>
          <div className="text-gray-400">of type</div>
          <div className="font-mono">{extrinsic.name}</div>
        </div>
      </div>
      <div className="flex ml-auto items-end text-sm">{formatDate(createdAt)}</div>
    </Row>
  )
}
