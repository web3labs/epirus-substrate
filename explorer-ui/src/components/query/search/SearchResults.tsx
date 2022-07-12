import React from "react"
import AccountAddress from "../../accounts/AccountAddress"
import CodeBadge from "../../badges/CodeBadge"
import CodeHash from "../../codes/CodeHash"

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
    return <div className="flex flex-col gap-y-2">
      <span className="text-sm">Account</span>
      <AccountAddress address={data.id}>
        {data.contract && <CodeBadge/>}
      </AccountAddress>
    </div>
  case "contracts":
    return <div className="flex flex-col gap-y-2">
      <span className="text-sm">Contract</span>
      <AccountAddress address={data.id}>
        <CodeBadge/>
      </AccountAddress>
    </div>
  case "contractCodes":
    return <div className="flex flex-col gap-y-2">
      <span className="text-sm">Code Hash</span>
      <CodeHash hash={data.id} />
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
