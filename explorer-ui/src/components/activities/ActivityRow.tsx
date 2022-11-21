import React from "react"

import { Activity, ActivityType } from "../../types/contracts"
import { CollapsibleRow, TypedRow } from "../commons/List"
import { shortDate } from "../../formats/time"
import AccountLink from "../accounts/AccountLink"
import { classNames } from "../../utils/strings"
import Lane from "../commons/Lane"
import { Label } from "../commons/Label"
import { getArgValue } from "../../utils/args"
import { useChainProperties } from "../../contexts/ChainContext"
import { AccountUnit } from "../commons/Text"
import { Definition, DefinitionList } from "../commons/Definitions"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import CodeLink from "../codes/CodeLink"

interface ActivityDisplay {
  alias: string,
  left?: React.ReactElement,
  right?: React.ReactElement
}

function toCodeHash ({
  obj
} : TypedRow<Activity>) {
  const { args } = obj
  if (args.codeHash) {
    return (<div className="flex gap-2 text-sm">
      <Label>To</Label>
      <CodeLink id={args.codeHash as string} />
    </div>)
  } else {
    return undefined
  }
}

function resolveActivityDisplay (
  params : TypedRow<Activity>
) : ActivityDisplay {
  const { short, currentId } = params
  const { type, from, to } = params.obj

  const template = {
    alias: type,
    left: from &&
    (<div className="flex gap-2 text-sm">
      <Label>From</Label>
      <AccountLink account={from} currentId={currentId} short={short} size={21} />
    </div>),
    right: to &&
    (<div className="flex gap-2 text-sm">
      <Label>To</Label>
      <AccountLink account={to} currentId={currentId} short={short} size={21} />
    </div>)
  }

  // Overrides by activity type
  switch (type) {
  case ActivityType.CONTRACT:
    return {
      ...template,
      alias: "instantiate"
    }
  case ActivityType.CONTRACTCALL:
    return {
      ...template,
      alias: "call"
    }
  case ActivityType.CODESTORED:
    return {
      ...template,
      alias: "store",
      right: toCodeHash(params)
    }
  case ActivityType.CODEUPDATED:
    return {
      ...template,
      alias: "upgrade"
    }
  case ActivityType.CONTRACTTERMINATE:
    return {
      ...template,
      alias: "terminate"
    }
  default:
    return template
  }
}

export default function ActivityRow ({
  obj,
  currentId,
  short = true
}: TypedRow<Activity>) {
  const { token } = useChainProperties()
  const { id, createdAt, args, extrinsic } = obj
  const displaySpec = resolveActivityDisplay({ obj, currentId, short })
  const { alias, left, right } = displaySpec
  const status = extrinsic.success ? "success" : "error"

  const extrinsicDetails = (
    <div className="flex flex-col md:flex-row border-t border-gray-200 bg-gray-50 py-4 px-6 mt-2 -mx-6 -mb-2">
      <DefinitionList>
        <Definition label="Block" term={
          <span className="font-mono">#{extrinsic.blockNumber}</span>
        }/>
        <Definition label="Extrinsic" term={
          <span className="font-mono">{extrinsic.blockNumber}-{extrinsic.indexInBlock}</span>
        }/>
        {args.data &&
        <Definition label="Data" term={
          <div className="max-h-32 overflow-y-auto font-mono break-all">{args.data}</div>
        }/>}
        <Definition label="Status" term={
          <div className={classNames(
            extrinsic.success ? "text-green-600" : "text-red-600",
            "text-xs font-semibold uppercase py-0.5 text-center"
          )}>
            {`${status}`}
          </div>
        }/>
        {extrinsic.error && <Definition label="Error" term={
          <pre id="json">{JSON.stringify(extrinsic.error, undefined, 2)}</pre>
        }/>}
      </DefinitionList>
    </div>
  )

  return (
    <CollapsibleRow key={id} collapsedDisplay={extrinsicDetails}>
      <Lane
        head={
          <div className="flex flex-col gap-2">
            <div className={classNames(
              `tag ${alias}`,
              "w-24 text-[0.68rem] font-semibold uppercase py-0.5 px-1 rounded text-center"
            )}>
              {alias}
            </div>
            <div className="flex gap-1 items-center">
              { status === "error" && <ExclamationCircleIcon height={18} width={18} className="text-orange-600"/>}
              <Label className="text-xs">{shortDate(createdAt)}</Label>
            </div>
          </div>
        }
        tail={
          <AccountUnit
            className="text-sm"
            amount={getArgValue(obj.args)}
            token={token}
          />
        }
      >
        {left}
        {right}
      </Lane>
    </CollapsibleRow>
  )
}
