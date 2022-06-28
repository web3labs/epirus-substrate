import React from "react"

import { Activity } from "../../types/contracts"
import { shortenHexString } from "../../formats/text"
import { Row, TypedRow } from "../List"
import { formatDate } from "../../formats/time"
import { useChainProperties } from "../../contexts/ChainContext"
import { argValue } from "../../utils/types"
import AccountLink from "../accounts/AccountLink"
import { formatUnits } from "../../formats/units"
import { classNames } from "../../utils/strings"
import Narrative from "../Narrative"

function printBalance ({ args }: Activity) {
  const { token } = useChainProperties()
  const va = argValue(args, "value")
  if (va === "0") {
    return null
  }
  return formatUnits(va, token)
}

function additionalDetails ({
  activity, currentId, short
} : {
  currentId?: string,
  short?: boolean,
  activity: Activity
}) {
  const { from, to } = activity

  return Object.assign(
    {},
    currentId && from.id === currentId
      ? { to: <AccountLink account={to} currentId={currentId} short={short} size={21} /> }
      : { from: <AccountLink account={from} currentId={currentId} short={short} size={21} /> },
    argsRecord(activity)
  )
}

function argsRecord ({ action, args }: Activity) {
  switch (action) {
  case "contracts.call": return {
    selector:
      argValue(args, "data")?.slice(0, 10)
  }
  case "contracts.instantiate": return {
    code:
      shortenHexString(argValue(args, "codeHash"))
  }
  default: return undefined
  }
}

function actionAlias (action: string) {
  switch (action) {
  case "contracts.instantiate":
  case "contracts.instantiateWithCode":
    return "instantiate"
  case "contracts.call":
    return "message"
  default:
    return action
  }
}

export default function ActivityRow ({
  obj,
  currentId,
  short = false
}: TypedRow<Activity>) {
  const { id, to, action, createdAt } = obj
  const alias = actionAlias(action)

  return (
    <Row key={id}>
      {currentId === undefined &&
        <AccountLink account={to} currentId={currentId} short={short} />
      }
      <div className="w-full flex flex-row flex-wrap items-center gap-x-2">
        <div className={classNames(
          `tag ${alias}`,
          "w-20 text-xs uppercase py-0.5 px-1 rounded text-center"
        )}>
          {alias}
        </div>
        <Narrative id={id} full={false} segments={[
          additionalDetails({ currentId, short, activity: obj }),
          { on: formatDate(createdAt) }
        ]} />
        <div className="ml-auto justify-end">
          {printBalance(obj)}
        </div>
      </div>
    </Row>
  )
}
