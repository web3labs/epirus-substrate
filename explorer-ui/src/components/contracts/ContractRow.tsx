import moment from "moment"
import React from "react"
import { NavLink } from "react-router-dom"
import { shortenHexString } from "../../formats/text"
import { LightContract } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import { Cols, Row } from "../List"
import AccountAddress from "../substrate/AccountAddress"

export default function ContractRow ({ contract, short = false }: { contract: LightContract, short?: boolean }) {
  const { id, deployedOn, deployer, account } = contract

  return (
    <Row key={id}>
      <Cols>
        <NavLink to={`/contracts/${account.id}`} className="link">
          <AccountAddress address={account.id} short={short}>
            <CodeBadge />
          </AccountAddress>
        </NavLink>

        <div className="text-sm capitalize">
          Deployed By
        </div>

        <div>
          <AccountAddress address={deployer.id} short={short}>
            {deployer.account && <CodeBadge />}
          </AccountAddress>
        </div>
      </Cols>
      <Cols>
        <div className="text-gray-400 text-xs">
          {moment(deployedOn).format("DD/MM/YYYY")}
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
