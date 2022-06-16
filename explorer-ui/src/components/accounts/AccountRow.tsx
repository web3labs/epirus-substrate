import React from "react"
import { formatBalance } from "@polkadot/util"

import { Account } from "../../types/accounts"
import AccountLink from "./AccountRef"
import { Cols, Row } from "../List"
import { useChainProperties } from "../../contexts/ChainContext"

export default function AccountRow ({ account, short = false }: { account: Account, short?: boolean }) {
  const { tokenDecimals, tokenSymbol } = useChainProperties()
  const { id, balance, codesOwned, contractsDeployed } = account

  return (
    <Row key={id}>
      <Cols>
        <AccountLink account={account} short={short}/>

        <div></div>

        <div>
          {formatBalance(balance.free, { decimals: tokenDecimals, forceUnit: tokenSymbol })}
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
