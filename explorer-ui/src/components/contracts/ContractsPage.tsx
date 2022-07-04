import React from "react"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import ContractList from "../contracts/ContractList"

export default function ContractsPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <ContractList
          pageQuery={{
            first: 15,
            orderBy: "createdAt_DESC"
          }}
          sortable={true}
          filterable={true}
          title="Contracts"
        />
      </Box>
    </>
  )
}
