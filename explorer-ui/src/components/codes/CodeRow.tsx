import React from "react"

import { Row, TypedRow } from "../commons/List"
import { shortDate } from "../../formats/time"
import AccountLink from "../accounts/AccountLink"
import { ContractCode } from "../../types/codes"
import { Label } from "../commons/Label"
import CodeLink from "./CodeLink"
import { CodeIcon } from "@heroicons/react/outline"
import Lane from "../commons/Lane"
import { getArgValue } from "../commons/Args"
import { useChainProperties } from "../../contexts/ChainContext"
import { AccountUnit } from "../commons/Text"

export default function CodeRow ({
  obj,
  currentId,
  short = true
}: TypedRow<ContractCode>) {
  const { token } = useChainProperties()
  const { id, contractsDeployed, createdAt, owner, createdFrom } = obj

  return (
    <Row key={id}>
      <Lane
        head={
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center text-sm">
              <span className="bg-lime-200 rounded-full p-0.5">
                <CodeIcon width={16} height={16} />
              </span>
              <CodeLink id={id}/>
            </div>
            <Label className="text-xs">
              {shortDate(createdAt)}
            </Label>
          </div>
        }
        tail={
          <AccountUnit amount={getArgValue(createdFrom.args)} token={token} />
        }
      >
        <div className="flex flex-wrap gap-2 text-sm">
          <Label>Owner</Label>
          <AccountLink account={owner} currentId={currentId} short={true} size={21} />
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {contractsDeployed && contractsDeployed.length > 0 &&
          <div className="flex gap-x-1">{contractsDeployed.length}<Label>instances</Label></div>
          }
        </div>
      </Lane>
    </Row>
  )
}
