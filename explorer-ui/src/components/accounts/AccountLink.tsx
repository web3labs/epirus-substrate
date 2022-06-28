import React from "react"
import { NavLink } from "react-router-dom"
import { AccountRef } from "../../types/accounts"
import CodeBadge from "../badges/CodeBadge"
import AccountAddress from "./AccountAddress"

export default function AccountLink (
  { account, currentId, className = "", short, size }
  : {
    account: AccountRef
    currentId?: string,
    className?: string
    short?: boolean,
    size?: number
  }
) {
  const { id, contract } = account
  const badgeSize = size ? (size / 3) + 2 : undefined

  if (id === currentId) {
    return (
      <AccountAddress
        address={id}
        short={short}
        className={className}
        size={size}
      >
        {contract && <CodeBadge size={badgeSize}/>}
      </AccountAddress>
    )
  }

  return (
    <NavLink to={`/${contract ? "contracts" : "accounts"}/${id}`} className="link">
      <AccountAddress
        address={id}
        short={short}
        className={className}
        size={size}
      >
        {contract && <CodeBadge size={badgeSize}/>}
      </AccountAddress>
    </NavLink>
  )
}
