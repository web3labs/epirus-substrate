import moment from "moment"
import React from "react"
import { NavLink } from "react-router-dom"
import { shortenHexString } from "../../formats/text"
import { LightContract } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import AccountAddress from "../substrate/AccountAddress"

export default function ContractRow ({ contract, short = false }: { contract: LightContract, short?: boolean }) {
  const { id, deployedOn, deployer, account } = contract

  return (
    <li key={id} className="font-mono pb-2 pt-4 pl-4 pr-4">
      <div className="grid grid-flow-col auto-cols-auto gap-2 items-center">
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
      </div>
      <div className="grid grid-flow-col auto-cols-auto gap-2 items-center">
        <div className="text-gray-400 text-xs">
          {moment(deployedOn).format("DD/MM/YYYY")}
        </div>

        <div className="text-gray-400 text-xs">
        </div>

        <div className="text-gray-400  text-xs flex justify-end">
          {shortenHexString(contract.contractCode.id)}
        </div>
      </div>
    </li>
  )
}
