import React from "react"
import Box from "../Box"
import Breadcrumbs from "../Breadcrumbs"
import AccountList from "../accounts/AccountList"

export default function AccountsPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <AccountList
          query={{ first: 15 }}
          sortable={true}
          title="Accounts"
        />
      </Box>
    </>
  )
}
