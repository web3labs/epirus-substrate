import React from "react"
import { TabQuery } from "../navigation/Tabs"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { textFilterOf } from "../query/filters/TextFilter"
import ContractList, { CONTRACT_SORT_OPTIONS } from "./ContractList"

export function contractByDeployer (id: string) {
  return {
    deployer: {
      id_eq: id
    }
  }
}

export function contractByCodeHash (id: string) {
  return {
    contractCode: {
      id_eq: id
    }
  }
}

export default function ContractTab ({ currentId, where }: TabQuery) {
  return (
    <ContractList
      currentId={currentId}
      pageQuery={{
        first: 10,
        where
      }}
      sortOptions={CONTRACT_SORT_OPTIONS}
      filterTypes={[
        DateRangeFilter,
        textFilterOf({
          selector: "id_eq",
          label: "Contract",
          template: value => (
            { id_eq: value }
          ),
          placeholder: "Address..."
        })
      ]}
    />
  )
}
