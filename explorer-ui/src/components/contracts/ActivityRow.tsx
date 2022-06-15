import React from "react"
import AccountAddress from "../substrate/AccountAddress"
import CodeBadge from "../badges/CodeBadge"
import { Activity, Arg } from "../../types/contracts"
import { shortenHexString } from "../../formats/text"
import { Cols, Row } from "../List"
import { formatDate } from "../../formats/time"

function showValue ({ args }: Activity) {
  const va = findArg(args, "value")
  if (va) {
    const bn = BigInt(va) / BigInt(1E10)
    return bn.toLocaleString()
  }

  return 0
}

function findArg (args: Arg[], name: string) {
  return args.find(a => a.name === name)?.value
}

function additionalDetails ({ action, args }: Activity) {
  switch (action) {
  case "contracts.call": return findArg(args, "data")?.slice(0, 10)
  case "contracts.instantiate": return shortenHexString(findArg(args, "codeHash"))
  default: return null
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
          <div className="flex flex-col text-sm capitalize overflow-hidden text-ellipsis gap-y-1">
            {action}
            <div className="text-gray-400 text-xs font-mono">
              {additionalDetails(activity)}
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <AccountAddress address={to} short={short} className="justify-end">
            <CodeBadge/>
          </AccountAddress>

          <div className="text-xs flex justify-end">
            {showValue(activity)} UNIT
          </div>
        </div>
      </Cols>
    </Row>
  )
}
