import { CodeIcon } from "@heroicons/react/solid"
import React from "react"
import AccountAddress from "../../accounts/AccountAddress"
import CodeBadge from "../../badges/CodeBadge"
import { AddressText } from "../../commons/Text"

interface Props {
  type:string,
  data: {
    id: string,
    contract?: {
      id: string
    }
  }
}

const TYPE_PATHS : Record<string, string> = {
  accounts: "accounts",
  contracts: "contracts",
  contractCodes: "codes"
}

export interface SearchResult extends Props {
  element: JSX.Element
}

export interface SearchResults {
  results: SearchResult[],
  fromSearch: boolean
}

export function linkOf ({ type, data }: SearchResult) {
  return `/${TYPE_PATHS[type]}/${data.id}`
}

function asDisplay ({ type, data } : Props) {
  switch (type) {
  case "accounts":
    return <div>
      <span>Account</span>
      <AccountAddress address={data.id}>
        {data.contract && <CodeBadge/>}
      </AccountAddress>
    </div>
  case "contracts":
    return <div>
      <span>Contract</span>
      <AccountAddress address={data.id}>
        <CodeBadge/>
      </AccountAddress>
    </div>
  case "contractCodes":
    return <div>
      <span>Code Hash</span>
      <div className="flex gap-2 items-center text-sm">
        <span className="bg-lime-200 rounded-full p-0.5">
          <CodeIcon width={16} height={16} />
        </span>
        <AddressText address={data.id} />
      </div>
    </div>
  default:
    return null
  }
}

export function SearchResultOption ({ type, data } : Props) {
  return (
    <div key={`sro-${type}-${data.id}`}>
      {asDisplay({ type, data })}
    </div>
  )
}
