import React from "react"
import { shortDate } from "../../../formats/time"
import { Event } from "../../../types/contracts"
import { Definition, DefinitionList } from "../../commons/Definitions"
import { Row, TypedRow } from "../../commons/List"
import DataView from "../DataView"

export default function EventRow ({
  obj,
  currentId,
  short
}: TypedRow<Event>) {
  const { id, blockNumber, indexInBlock, createdAt, data, extrinsic, decodedEvent } = obj

  return (
    <Row key={id}>
      <DefinitionList>
        <Definition label="ID" term={<span className="font-mono">{blockNumber}-{indexInBlock}</span>} />
        <Definition label="Extrinsic" term={
          <div className="flex gap-2">

            <span className="font-mono">{extrinsic.blockNumber}-{extrinsic.indexInBlock}</span>
            <span>{extrinsic.name}</span>
          </div>
        } />

        <Definition label="Emitted" term={
          shortDate(createdAt)
        }
        />
      </DefinitionList>
      <DataView rawData={data} decodedData={decodedEvent} label={"Event"}/>
    </Row>
  )
}
