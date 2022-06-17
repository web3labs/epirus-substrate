import React from "react"

import { Account } from "../../types/accounts"
import AccountLink from "./AccountLink"
import { Cols, Row, TypedRow } from "../List"
import { useChainProperties } from "../../contexts/ChainContext"
import { formatUnits } from "../../formats/units"

export default function AccountRow ({
  obj,
  currentId,
  short = false
}: TypedRow<Account>) {
  const { token } = useChainProperties()
  const { id, balance, codesOwned, contractsDeployed } = obj

  return (
    <Row key={id}>
      <Cols>
        <AccountLink account={obj} currentId={currentId} short={short} />

        <div></div>

        <div>
          {formatUnits(balance.free, token)}
        </div>
      </Cols>
      <div className="flex flex-row flex-wrap gap-x-2 justify-end text-xs">
        {contractsDeployed && contractsDeployed.length > 0 &&
          <div className="flex gap-x-1">{contractsDeployed.length}<span className="text-gray-400">contracts</span></div>
        }
        {codesOwned && codesOwned.length > 0 &&
          <div className="flex gap-x-1">{codesOwned.length}<span className="text-gray-400">codes</span></div>
        }
      </div>
    </Row>
  )
}
