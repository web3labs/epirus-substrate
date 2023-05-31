import React from "react"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import AccountList, { ACCOUNT_SORT_OPTIONS } from "../accounts/AccountList"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { textFilterOf } from "../query/filters/TextFilter"
import SideBar from "../SideBar"

export default function AccountsPage () {
  return (
    <>
      <Breadcrumbs/>
      <div className="flex flex-row gap-2 mt-2">
        <SideBar highlight={1}/>
        <Box>
          <AccountList
            pageQuery={{
              first: 15,
              orderBy: "createdAt_DESC"
            }}
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
      </div>
    </>
  )
}
