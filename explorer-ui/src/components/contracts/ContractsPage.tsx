import React from "react"
import Box from "../Box"
import Breadcrumbs from "../Breadcrumbs"
import ListContracts from "./ListContracts"

export default function ContractsPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <ListContracts
          query={{ first: 25 }}
          sortable={true}
          title="Contracts"
        />
      </Box>
    </>
  )
}
