import React from "react"

import { Activity } from "../../types/contracts"
// import { shortenHexString } from "../../formats/text"
import { Row, TypedRow } from "../commons/List"
import { formatDate } from "../../formats/time"
import { useChainProperties } from "../../contexts/ChainContext"
import { argValue } from "../../utils/types"
import AccountLink from "../accounts/AccountLink"
import { formatUnits } from "../../formats/units"
import { classNames } from "../../utils/strings"
import Lane from "../commons/Lane"
import { Label } from "../commons/Label"

function printBalance ({ args }: Activity) {
  const { token } = useChainProperties()
  const va = argValue(args, "value")
  if (va === "0") {
    return null
  }
  return formatUnits(va, token)
}

/*
function additionalDetails ({ action, args }: Activity) {
  switch (action) {
  case "contracts.call":
    return { selector: argValue(args, "data")?.slice(0, 10) }
  case "contracts.instantiate":
    return { code: shortenHexString(argValue(args, "codeHash")) }
  default:
    return null
  }
} */

function actionAlias (action: string) {
  switch (action) {
  case "contracts.instantiate":
  case "contracts.instantiateWithCode":
    return "instantiate"
  case "contracts.call":
    return "call"
  default:
    return action
  }
}

export default function ActivityRow ({
  obj,
  currentId,
  short = false
}: TypedRow<Activity>) {
  const { id, from, to, action, createdAt } = obj
  const alias = actionAlias(action)

  return (
    <Row key={id}>
      <Lane
        head={
          <div className="flex flex-col gap-2">
            <div className={classNames(
              `tag ${alias}`,
              "w-20 text-xs uppercase py-0.5 px-1 rounded text-center"
            )}>
              {`${alias}`}
            </div>
            <Label className="text-xs">{formatDate(createdAt)}</Label>
          </div>
        }
        tail={
          printBalance(obj)
        }
      >
        <div className="flex gap-2 text-sm">
          <Label>From</Label><AccountLink account={from} currentId={currentId} short={short} size={21} />
        </div>
        <div className="flex gap-2 text-sm">
          <Label>To</Label><AccountLink account={to} currentId={currentId} short={short} size={21} />
        </div>
      </Lane>
    </Row>
  )
}
