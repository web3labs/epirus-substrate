import React from "react"
import { NavLink } from "react-router-dom"
import { AccountRef } from "../../types/accounts"
import { classNames } from "../../utils/strings"
import CodeBadge from "../badges/CodeBadge"
import AccountAddress from "./AccountAddress"

export default function AccountLink (
  { account, currentId, className = "", short = false }
  : {
    account: AccountRef
    currentId?: string,
    className?: string
    short?: boolean
  }
) {
  const { id, contract } = account

  if (id === currentId) {
    return (
      <AccountAddress
        address={id}
        short={short}
        className={classNames(
          "text-gray-500",
          className
        )}
      >
        {contract && <CodeBadge/>}
      </AccountAddress>
    )
  }

  return (
    <NavLink to={`/${contract ? "contracts" : "accounts"}/${id}`} className="link">
      <AccountAddress address={id} short={short} className={className}>
        {contract && <CodeBadge/>}
      </AccountAddress>
    </NavLink>
  )
}
