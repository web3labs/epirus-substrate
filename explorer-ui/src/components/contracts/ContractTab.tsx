import React from "react"
import { TabQuery } from "../navigation/Tabs"
import ContractList from "./ContractList"

export function contractByDeployer (id: string) {
  return {
    deployer: {
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
    />
  )
}
