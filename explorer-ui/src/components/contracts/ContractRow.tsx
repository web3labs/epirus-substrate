import moment from "moment"
import React from "react"
import { NavLink } from "react-router-dom"
import { shortenHexString } from "../../formats/text"
import { LightContract } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import AccountAddress from "../substrate/AccountAddress"

export default function ContractRow ({ contract }: { contract: LightContract }) {
  const { id, deployedOn, deployer, account } = contract

  return (
    <li key={id} className="font-mono pb-2 pt-4 pl-4 pr-4">
      <div className="grid grid-cols-3 gap-2 items-center">
        <NavLink to={`/contracts/${account.id}`} className="link">
          <AccountAddress address={account.id}>
            <CodeBadge />
          </AccountAddress>
        </NavLink>

        <div className="text-sm capitalize">
          Deployed By
        </div>

        <div>
          <AccountAddress address={deployer.id}>
            {deployer.account && <CodeBadge />}
          </AccountAddress>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 items-center">
        <div className="text-gray-400 text-xs">
          {moment(deployedOn).format("DD/MM/YYYY")}
        </div>

        <div className="text-gray-400 text-xs pl-1 font-mono">
          {shortenHexString(contract.contractCode.id)}
        </div>
        <div className="text-sm flex justify-end">
          -
        </div>
      </div>
    </li>
  )
}
