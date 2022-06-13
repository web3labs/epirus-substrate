import moment from "moment"
import React from "react"
// import { shortenHexString } from "../../formats/text"
import AccountAddress from "../substrate/AccountAddress"
import CodeBadge from "../badges/CodeBadge"
import { Activity, Arg } from "../../types/contracts"
import { shortenHexString } from "../../formats/text"

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
    skeletons.push(<li key={`arsk-${i}`} className="pb-2 pt-4 pl-4 pr-4">
      <div className="grid grid-cols-3 gap-2 items-center">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 skeleton rounded-full"></div>
          <div className="h-3 skeleton w-[50%]"></div>
        </div>
        <div className="h-3 skeleton w-[50%] "></div>
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 skeleton rounded-full"></div>
          <div className="h-3 skeleton w-[50%]"></div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 items-center pt-2">
        <div className="h-3 skeleton w-[35%]"></div>
        <div className="h-3 skeleton w-0"></div>
        <div className="h-3 skeleton w-[35%] ml-auto"></div>
      </div>
    </li>)
  }
  return (<>
    {skeletons}
  </>)
}

export default function ActivityRow ({ activity }: { activity: Activity }) {
  const { id, from, to, action, createdAt } = activity

  return (
    <li key={id} className="font-mono pb-2 pt-4 pl-4 pr-4">
      <div className="grid grid-cols-3 gap-2 items-center">
        <div>
          <AccountAddress address={from} />
        </div>

        <div className="text-sm capitalize">
          {action}
        </div>

        <div>
          <AccountAddress address={to}>
            <CodeBadge/>
          </AccountAddress>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 items-center">
        <div className="text-gray-400 text-xs">
          {moment(createdAt).format("DD/MM/YYYY")}
        </div>

        <div className="text-gray-400 text-xs pl-1 font-mono">
          {additionalDetails(activity)}
        </div>
        <div className="text-xs flex justify-end">
          {showValue(activity)} UNIT
        </div>
      </div>
    </li>
  )
}
