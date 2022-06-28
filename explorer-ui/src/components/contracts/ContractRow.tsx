import React from "react"
import { shortenHexString } from "../../formats/text"
import { formatDate } from "../../formats/time"
import { LightContract } from "../../types/contracts"
import AccountLink from "../accounts/AccountLink"
import Narrative from "../Narrative"
import { Row, TypedRow } from "../List"
import { NavLink } from "react-router-dom"

export default function ContractRow ({
  obj,
  currentId,
  short
}: TypedRow<LightContract>) {
  const { id, createdAt, deployer, account, contractCode } = obj

  return (
    <Row key={id}>
      <AccountLink account={account} currentId={currentId} short={short} />
      <Narrative
        id={id}
        segments={{
          deployer: <AccountLink
            account={deployer}
            currentId={currentId}
            short={true}
            size={21}
          />,
          code: <NavLink to={`/codes/${contractCode.id}`} className="link">
            {shortenHexString(contractCode.id)}
          </NavLink>,
          on: formatDate(createdAt)
        }} />
    </Row>
  )
}
