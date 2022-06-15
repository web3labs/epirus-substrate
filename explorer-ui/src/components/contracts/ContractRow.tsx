import React from "react"
import { NavLink } from "react-router-dom"
import { shortenHexString } from "../../formats/text"
import { formatDate } from "../../formats/time"
import { LightContract } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import { Cols, Row } from "../List"
import AccountAddress from "../substrate/AccountAddress"

export default function ContractRow ({ contract, short = false }: { contract: LightContract, short?: boolean }) {
  const { id, createdAt, deployer, account } = contract

  return (
    <Row key={id}>
      <Cols>
        <NavLink to={`/contracts/${account.id}`} className="link">
          <AccountAddress address={account.id} short={short}>
            <CodeBadge />
          </AccountAddress>
        </NavLink>

        <div className="text-sm">
          deployed by
        </div>

        <div>
          <AccountAddress address={deployer.id} short={short}>
            {deployer.account && <CodeBadge />}
          </AccountAddress>
        </div>
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
