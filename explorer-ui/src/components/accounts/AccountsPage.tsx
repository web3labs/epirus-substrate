import React from "react"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import AccountList from "../accounts/AccountList"

export default function AccountsPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <AccountList
          pageQuery={{ first: 15 }}
          sortable={true}
          filterable={true}
          title="Accounts"
        />
      </Box>
    </>
  )
}
