import React from "react"
// import { shortDate } from "../../formats/time"
import { Event } from "../../types/blocks"
import { Definition, DefinitionList } from "../commons/Definitions"
import { Row, TypedRow } from "../commons/List"
// import DataView from "../../components/contracts/DataView"
// import { classNames } from "../../utils/strings"

export default function EventRow ({ obj, currentId, short }: TypedRow<Event>) {
  const {
    id,
    name
  } = obj
  // const alias = "withdraw"
  return (
    <Row key={id}>
      { /*
      <div className="flex flex-row gap-2 md:flex-col">
        <div className={classNames(
          `tag ${alias}`,
          "w-24 text-[0.68rem] font-semibold uppercase py-0.5 px-1 rounded text-center"
        )}>
          {alias}
        </div>
      </div>
        */ }
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
      </DefinitionList>
    </Row>
  )
}
