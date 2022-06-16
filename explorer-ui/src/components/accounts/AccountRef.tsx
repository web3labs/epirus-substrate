import React from "react"
import { NavLink } from "react-router-dom"
import { AccountRef } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import AccountAddress from "./AccountAddress"

export default function AccountLink (
  { account, className, short = false }
  : {
    account: AccountRef
    className?: string
    short?: boolean
  }
) {
  const { id, contract } = account
  return (
    <NavLink to={`/${contract ? "contracts" : "accounts"}/${id}`} className="link">
      <AccountAddress address={id} short={short} className={className}>
        {contract && <CodeBadge/>}
      </AccountAddress>
    </NavLink>
  )
}
