import React from "react"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import ContractList, { CONTRACT_SORT_OPTIONS } from "../contracts/ContractList"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { textFilterOf } from "../query/filters/TextFilter"

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
            }),
            textFilterOf({
              selector: "deployer",
              label: "Deployer",
              template: value => (
                { deployer: { id_eq: value } }
              ),
              placeholder: "Address..."
            })
          ]}
          title="Contracts"
        />
      </Box>
    </>
  )
}
