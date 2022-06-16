import React from "react"
import Box from "../Box"
import Breadcrumbs from "../Breadcrumbs"
import ContractList from "../contracts/ContractList"

export default function ContractsPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <ContractList
          query={{ first: 25 }}
          sortable={true}
          title="Contracts"
        />
      </Box>
    </>
  )
}
