import React from "react"
import Box from "../Box"
import ListContracts from "./ListContracts"

export default function ContractsPage () {
  return (
    <Box>
      <ListContracts
        query={{ first: 25 }}
        sortable={true}
        title="Contracts"
      />
    </Box>
  )
}
