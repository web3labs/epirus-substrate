import React from "react"

import { Activity } from "../../types/contracts"
import { shortenHexString } from "../../formats/text"
import { Cols, Row } from "../List"
import { formatDate } from "../../formats/time"
import { useChainProperties } from "../../contexts/ChainContext"
import { argValue } from "../../utils/types"
import AccountLink from "../accounts/AccountRef"
import { formatUnits } from "../../formats/units"

function printBalance ({ args }: Activity) {
  const { token } = useChainProperties()
  const va = argValue(args, "value")
  return formatUnits(va, token)
}

function additionalDetails ({ action, args }: Activity) {
  switch (action) {
  case "contracts.call": return argValue(args, "data")?.slice(0, 10)
  case "contracts.instantiate": return shortenHexString(argValue(args, "codeHash"))
  default: return null
  }
}

function actionAlias (action: string) {
  switch (action) {
  case "contracts.instantiate":
  case "contracts.instantiateWithCode":
    return "creates"
  case "contracts.call":
    return "calls"
  default:
    return action
  }
}

export default function ActivityRow ({ activity, short }: { activity: Activity, short: boolean }) {
  const { id, from, to, action, createdAt } = activity

  return (
    <Row key={id}>
      <Cols>
        <div>
          <AccountLink account={from} short={true}/>

          <div className="text-gray-400 text-xs">
            {formatDate(createdAt)}
          </div>
        </div>

        <div className="flex flex-wrap basis-1/6 items-stretch content-center">
          <div className="flex flex-col text-sm overflow-hidden text-ellipsis gap-y-1">
            {actionAlias(action)}
            <div className="text-gray-400 text-xs font-mono">
              {additionalDetails(activity)}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <AccountLink account={to} short={true} className="justify-end"/>

          <div className="text-xs flex justify-end">
            {printBalance(activity)}
          </div>
        </div>
      </Cols>
    </Row>
  )
}
