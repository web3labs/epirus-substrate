import React from "react"
import { LightAccount } from "../../types/contracts"
import AccountLink from "./AccountRef"
import { Cols, Row } from "../List"

export default function AccountRow ({ account, short = false }: { account: LightAccount, short?: boolean }) {
  const { id } = account

  return (
    <Row key={id}>
      <Cols>
        <AccountLink account={account} short={short}/>

        <div className="text-sm">
          deployed by
        </div>

        <div></div>
      </Cols>
    </Row>
  )
}
