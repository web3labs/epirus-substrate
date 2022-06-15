import React from "react"
import { formatBalance } from "@polkadot/util"

import AccountAddress from "../substrate/AccountAddress"
import CodeBadge from "../badges/CodeBadge"
import { Activity } from "../../types/contracts"
import { shortenHexString } from "../../formats/text"
import { Cols, Row } from "../List"
import { formatDate } from "../../formats/time"
import { NavLink } from "react-router-dom"
import { useChainProperties } from "../../contexts/ChainContext"
import { argValue } from "../../utils/types"

function printBalance ({ args }: Activity) {
  const { tokenDecimals, tokenSymbol } = useChainProperties()
  const va = argValue(args, "value")
  return formatBalance(va, { decimals: tokenDecimals, forceUnit: tokenSymbol })
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

export function ActivityRowSkeleton ({ size = 5 }: {size?: number}) {
  const skeletons : JSX.Element[] = []
  for (let i = 0; i < size; i++) {
    skeletons.push(
      <Row key={`arsk-${i}`}>
        <Cols>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 skeleton rounded-full"></div>
            <div className="h-3 skeleton w-[50%]"></div>
          </div>
          <div className="h-3 skeleton w-[50%] "></div>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 skeleton rounded-full"></div>
            <div className="h-3 skeleton w-[50%]"></div>
          </div>
        </Cols>
        <Cols>
          <div className="h-3 skeleton w-[35%]"></div>
          <div className="h-3 skeleton w-0"></div>
          <div className="h-3 skeleton w-[35%] ml-auto"></div>
        </Cols>
      </Row>
    )
  }
  return (<>
    {skeletons}
  </>)
}

export default function ActivityRow ({ activity, short }: { activity: Activity, short: boolean }) {
  const { id, from, to, action, createdAt } = activity

  return (
    <Row key={id}>
      <Cols>
        <div>
          <AccountAddress address={from} short={short} />

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
          <NavLink to={`/contracts/${to}`} className="link">
            <AccountAddress address={to} short={short} className="justify-end">
              <CodeBadge/>
            </AccountAddress>
          </NavLink>

          <div className="text-xs flex justify-end">
            {printBalance(activity)}
          </div>
        </div>
      </Cols>
    </Row>
  )
}
