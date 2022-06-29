import React from "react"

import { Account } from "../../types/accounts"
import AccountLink from "./AccountLink"
import { Row, TypedRow } from "../List"
import { useChainProperties } from "../../contexts/ChainContext"
import { formatUnits } from "../../formats/units"
import { formatDate } from "../../formats/time"
import { Label } from "../commons/Label"
import Lane from "../Lane"

export default function AccountRow ({
  obj,
  currentId,
  short = false
}: TypedRow<Account>) {
  const { token } = useChainProperties()
  const { id, balance, codesOwned, contractsDeployed, createdAt } = obj

  return (
    <Row key={id}>
      <Lane
        head={
          <AccountLink account={obj} currentId={currentId} short={short} />
        }
        tail={<Label>{formatDate(createdAt)}</Label>}
      />
      <Lane
        tail={<div className="flex gap-2">
          {codesOwned && codesOwned.length > 0 &&
          <span>{codesOwned.length} <Label>codes</Label></span>
          }
          {contractsDeployed && contractsDeployed.length > 0 &&
          <span>{contractsDeployed.length} <Label>instances</Label></span>
          }
        </div>}
      >
        {balance && <div className="flex gap-2"><Label>Balance</Label>
          {formatUnits(balance.free, token)} </div>}
      </Lane>
    </Row>
  )
}
