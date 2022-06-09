import moment from "moment"
import React from "react"
import { shortenHexString } from "../../formats/text"
import { ContractExtrinsic } from "../../types/Extrinsics"
import AccountAddress from "./AccountAddress"
import CodeBadge from "../badges/CodeBadge"

function additionalDetails ({ data, method, codeHash }: ContractExtrinsic) {
  switch (method) {
    case "call": return data.slice(0, 10)
    case "instantiate": return shortenHexString(codeHash)
    case "instantiateWithCode": return shortenHexString(codeHash)
    default: return null
  }
}

export default function ExtrinsicRow ({ extrinsic }: { extrinsic: ContractExtrinsic }) {
  const { id, signer, dest, method, createdAt, value } = extrinsic

  return (
    <li key={id} className="pb-2 pt-4 pl-4 pr-4">
      <div className="grid grid-cols-3 gap-2 items-center">
        <div>
          <AccountAddress address={signer} />
        </div>

        <div className="text-sm capitalize">
          {method}
        </div>

        <div>
          <AccountAddress address={dest} badge={CodeBadge()} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 items-center">
        <div className="text-gray-400 text-xs">
          {moment(createdAt).format("DD/MM/YYYY")}
        </div>

        <div className="text-gray-400 text-xs pl-1 font-mono">
          {additionalDetails(extrinsic)}
        </div>
        <div className="text-sm flex justify-end">
          {value} ROC
        </div>
      </div>
    </li>
  )
}
