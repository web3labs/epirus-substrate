import React from "react"
import { shortenHexString } from "../../formats/text"
import { formatDate } from "../../formats/time"
import { LightContract } from "../../types/contracts"
import AccountLink from "../accounts/AccountLink"
import { Cols, Row, TypedRow } from "../List"

export default function ContractRow ({
  obj,
  currentId,
  short = false
}: TypedRow<LightContract>) {
  const { id, createdAt, deployer, account, contractCode } = obj

  return (
    <Row key={id}>
      <Cols>
        <AccountLink account={account} currentId={currentId} short={short} />

        <div className="text-sm">
          deployed by
        </div>

        <AccountLink account={deployer} currentId={currentId} short={short} />
      </Cols>
      <Cols>
        <div className="text-gray-400 text-xs">
          {formatDate(createdAt)}
        </div>

        <div className="text-gray-400 text-xs">
        </div>

        <div className="font-mono text-gray-400 text-xs flex justify-end">
          {shortenHexString(contractCode.id)}
        </div>
      </Cols>
    </Row>
  )
}
