import React from "react"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import AccountList, { ACCOUNT_SORT_OPTIONS } from "../accounts/AccountList"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { textFilterOf } from "../query/filters/TextFilter"

export default function AccountsPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <AccountList
          pageQuery={{ first: 15 }}
          sortOptions={ACCOUNT_SORT_OPTIONS}
          filterTypes={
            [
              DateRangeFilter,
              textFilterOf({
                selector: "id_eq",
                label: "Account",
                template: value => (
                  { id_eq: value }
                ),
                placeholder: "Address..."
              })
            ]
          }
          title="Accounts"
        />
      </Box>
    </>
  )
}
