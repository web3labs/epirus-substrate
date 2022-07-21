import React from "react"

import { Activity } from "../../types/contracts"
import { CollapsibleRow, TypedRow } from "../commons/List"
import { shortDate } from "../../formats/time"
import AccountLink from "../accounts/AccountLink"
import { classNames } from "../../utils/strings"
import Lane from "../commons/Lane"
import { Label } from "../commons/Label"
import { getArgValue } from "../commons/Args"
import { useChainProperties } from "../../contexts/ChainContext"
import { AccountUnit } from "../commons/Text"
import { Definition, DefinitionList } from "../commons/Definitions"

function typeAlias (type: string) {
  switch (type) {
  case "CONTRACT":
    return "instantiate"
  case "CONTRACTCALL":
    return "call"
  case "CODEUPDATED":
    return "upgrade"
  default:
    return type
  }
}

export default function ActivityRow ({
  obj,
  currentId,
  short = true
}: TypedRow<Activity>) {
  const { token } = useChainProperties()
  const { id, from, to, type, createdAt, args, extrinsic } = obj
  const value = getArgValue(obj.args)
  const alias = typeAlias(type)
  const status = extrinsic.success ? "success" : "error"

  const extrinsicDetails = (
    <div className="flex flex-col md:flex-row border-t border-gray-200 bg-gray-50 py-4 px-6 mt-2 -mx-6 -mb-2">
      <DefinitionList>
        <Definition label="Extrinsic" term={
          <span className="font-mono">{extrinsic.id}</span>
        }/>
        <Definition label="Data" term={
          <span className="font-mono break-all">{args.data}</span>
        }/>
        <Definition label="Status" term={
          <div className={classNames(
            extrinsic.success ? "text-green-600" : "text-red-600",
            "text-xs font-semibold uppercase py-0.5 px-1 text-center"
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
              {`${alias}`}
            </div>
            <Label className="text-xs">{shortDate(createdAt)}</Label>
          </div>
        }
      >
        {from &&
          (<div className="flex gap-2 text-sm">
            <Label>From</Label>
            <AccountLink account={from} currentId={currentId} short={short} size={21} />
          </div>)
        }
        {to &&
          (<div className="flex gap-2 text-sm">
            <Label>To</Label>
            <AccountLink account={to} currentId={currentId} short={short} size={21} />
          </div>)
        }
        {value &&
          (<div className="flex gap-2 text-sm">
            <Label>Amount</Label>
            <AccountUnit className="text-sm" amount={value} token={token} />
          </div>)
        }
      </Lane>
    </CollapsibleRow>
  )
}
