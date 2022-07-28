import React from "react"
import { shortDate } from "../../formats/time"
import { Event } from "../../types/contracts"
import { Definition, DefinitionList } from "../commons/Definitions"
import { Row, TypedRow } from "../commons/List"

export default function EventRow ({
  obj,
  currentId,
  short = true
}: TypedRow<Event>) {
  const { id, blockNumber, indexInBlock, createdAt, data, extrinsic } = obj

  return (
    <Row key={id}>
      <DefinitionList>
        <Definition label="ID" term={<span className="font-mono">{blockNumber}-{indexInBlock}</span>} />
        <Definition label="Extrinsic" term={
          <div className="flex flex-col">
            <span>{extrinsic.name}</span>
            <span className="font-mono">{extrinsic.blockNumber}-{extrinsic.indexInBlock}</span>
          </div>
        } />

        <Definition label="Emitted" term={
          shortDate(createdAt)
        }
        />
        <Definition label="Data" term={
          <span className="font-mono break-all">
            {data}
          </span>
        }
        />
      </DefinitionList>
    </Row>
  )
}
