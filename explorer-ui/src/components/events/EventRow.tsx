import React from "react"
import { formatDate } from "../../formats/time"
import { Event } from "../../types/contracts"
import { Row, TypedRow } from "../commons/List"

export default function EventRow ({
  obj,
  currentId,
  short = false
}: TypedRow<Event>) {
  const { id, createdAt, data, extrinsic } = obj

  return (
    <Row key={id}>
      <div className="flex flex-col gap-2 max-w-[75%] text-sm">
        <div className="text-gray-400">Extrinsic</div>
        <div className="font-mono">{extrinsic.id}</div>
        <div className="text-gray-400">Data</div>
        <div className="code">{data}</div>
      </div>
      <div className="flex ml-auto text-sm">{formatDate(createdAt)}</div>
    </Row>
  )
}
