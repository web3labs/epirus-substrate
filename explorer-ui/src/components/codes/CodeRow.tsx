import React from "react"

import { Row, TypedRow } from "../List"
import { formatDate } from "../../formats/time"
import AccountLink from "../accounts/AccountLink"
import { ContractCode } from "../../types/codes"
import { Label } from "../commons/Label"
import CodeLink from "./CodeLink"
import { CodeIcon } from "@heroicons/react/outline"

export default function CodeRow ({
  obj,
  currentId,
  short = false
}: TypedRow<ContractCode>) {
  const { id, contractsDeployed, createdAt, owner } = obj

  return (
    <Row key={id}>
      <div className="flex flex-row gap-x-2 items-center text-sm">
        <span className="bg-lime-200 rounded-full p-0.5">
          <CodeIcon width={16} height={16} />
        </span>
        <CodeLink id={id}/>
      </div>
      <div className="w-full flex flex-row flex-wrap gap-x-2 text-sm">
        <Label>owned by</Label>
        <AccountLink account={owner} currentId={currentId} short={true} size={21} />
      </div>
      <div className="flex flex-row flex-wrap gap-x-2 justify-end text-xs">
        <div className="text-gray-400 text-xs">
          {formatDate(createdAt)}
        </div>
        {contractsDeployed && contractsDeployed.length > 0 &&
          <div className="flex gap-x-1">{contractsDeployed.length}<span className="text-gray-400">instances</span></div>
        }
      </div>
    </Row>
  )
}
