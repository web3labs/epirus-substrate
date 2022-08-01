import React from "react"

import { Row, TypedRow } from "../commons/List"
import { shortDate } from "../../formats/time"
import AccountLink from "../accounts/AccountLink"
import { ContractCode } from "../../types/codes"
import { Label } from "../commons/Label"
import CodeLink from "./CodeLink"
import Lane from "../commons/Lane"
import { getArgValue } from "../../utils/args"
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
            <CodeLink id={id}/>
            <Label className="text-xs">
              {shortDate(createdAt)}
            </Label>
          </div>
        }
        tail={
          <AccountUnit
            className="text-sm"
            amount={getArgValue(createdFrom.args)}
            token={token}
          />
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
