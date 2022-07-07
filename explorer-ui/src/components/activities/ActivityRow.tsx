import React from "react"

import { Activity } from "../../types/contracts"
import { Row, TypedRow } from "../commons/List"
import { formatDate } from "../../formats/time"
import AccountLink from "../accounts/AccountLink"
import { classNames } from "../../utils/strings"
import Lane from "../commons/Lane"
import { Label } from "../commons/Label"
import { formatValue } from "../commons/Args"
import { useChainProperties } from "../../contexts/ChainContext"

function actionAlias (action: string) {
  switch (action.toLocaleLowerCase()) {
  case "contracts.instantiate":
  case "contracts.instantiatewithcode":
  case "contracts.instantiate_with_code":
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
  const { token } = useChainProperties()
  const { id, from, to, action, createdAt } = obj
  const alias = actionAlias(action)

  return (
    <Row key={id}>
      <Lane
        head={
          <div className="flex flex-col gap-2">
            <div className={classNames(
              `tag ${alias}`,
              "w-24 text-[0.68rem] font-semibold uppercase py-0.5 px-1 rounded text-center"
            )}>
              {`${alias}`}
            </div>
            <Label className="text-xs">{formatDate(createdAt)}</Label>
          </div>
        }
        tail={
          formatValue(obj.args, token)
        }
      >
        {from &&
          (<div className="flex gap-2 text-sm">
            <Label>From</Label><AccountLink account={from} currentId={currentId} short={short} size={21} />
          </div>)
        }
        {to &&
          (<div className="flex gap-2 text-sm">
            <Label>To</Label><AccountLink account={to} currentId={currentId} short={short} size={21} />
          </div>)
        }
      </Lane>
    </Row>
  )
}
