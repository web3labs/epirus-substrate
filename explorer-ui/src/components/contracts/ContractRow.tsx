import React from "react"
import { formatDate } from "../../formats/time"
import { LightContract } from "../../types/contracts"
import AccountLink from "../accounts/AccountLink"
import Lane from "../commons/Lane"
import { Row, TypedRow } from "../commons/List"
import CodeLink from "../codes/CodeLink"
import { Label } from "../commons/Label"

export default function ContractRow ({
  obj,
  currentId,
  short
}: TypedRow<LightContract>) {
  const { id, createdAt, deployer, account, contractCode } = obj

  return (
    <Row key={id}>
      <Lane
        head={
          <div className="flex flex-col gap-1">
            <AccountLink account={account} currentId={currentId} short={short} />
            <Label className="text-xs">{formatDate(createdAt)}</Label>
          </div>
        }
      >
        <div className="flex gap-2 text-sm">
          <Label>Deployer</Label> <AccountLink
            account={deployer}
            currentId={currentId}
            short={true}
            size={21}
          />
        </div>
        <div className="flex gap-2 text-sm">
          <Label>Code</Label> <CodeLink id={contractCode.id} short={true} />
        </div>
      </Lane>
    </Row>
  )
}
