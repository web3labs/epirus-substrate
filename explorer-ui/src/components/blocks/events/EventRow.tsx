import React from "react"
// import { shortDate } from "../../formats/time"
import { Event } from "../../../types/blocks"
import { Definition, DefinitionList } from "../../commons/Definitions"
import { Row, TypedRow } from "../../commons/List"
// import DataView from "../../components/contracts/DataView"

export default function EventRow ({ obj, currentId, short }: TypedRow<Event>) {
  const {
    id,
    name,
    extrinsic
  } = obj

  return (
    <Row key={id}>
      <DefinitionList>
        <Definition
          label="ID"
          term={
            <span className="font-mono">
              {id}
            </span>
          }
        />
        <Definition
          label="Name"
          term={
            <span className="font-mono">
              {name}
            </span>
          }
        />
        <Definition
          label="Extrinsic"
          term={
            <div className="flex gap-2">
              <span className="font-mono">
                {extrinsic.id}
              </span>
              <span>{extrinsic.call.name}</span>
            </div>
          }
        />
      </DefinitionList>
    </Row>
  )
}
