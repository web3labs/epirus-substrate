import React from "react"
import { shortenHexString } from "../../formats/text"
import { formatDate } from "../../formats/time"
import { LightContract } from "../../types/contracts"
import AccountLink from "../accounts/AccountRef"
import { Cols, Row } from "../List"

export default function ContractRow ({ contract, short = false }: { contract: LightContract, short?: boolean }) {
  const { id, createdAt, deployer, account } = contract

  return (
    <Row key={id}>
      <Cols>
        <AccountLink account={account} short={short}/>

        <div className="text-sm">
          deployed by
        </div>

        <AccountLink account={deployer} short={short}/>
      </Cols>
      <Cols>
        <div className="text-gray-400 text-xs">
          {formatDate(createdAt)}
        </div>

        <div className="text-gray-400 text-xs">
        </div>

        <div className="font-mono text-gray-400 text-xs flex justify-end">
          {shortenHexString(contract.contractCode.id)}
        </div>
      </Cols>
    </Row>
  )
}
