import React from "react"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import CodeList, { CODE_SORT_OPTIONS } from "../codes/CodeList"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { textFilterOf } from "../query/filters/TextFilter"
import SideBar from "../SideBar"

export default function CodesPage () {
  return (
    <>
      <Breadcrumbs/>
      <div className="flex flex-row gap-2">
        <SideBar highlight={5}/>
        <Box className="content">
          <CodeList
            pageQuery={{
              first: 15,
              orderBy: "createdAt_DESC"
            }}
            sortOptions={CODE_SORT_OPTIONS}
            filterTypes={
              [
                DateRangeFilter,
                textFilterOf({
                  selector: "id_eq",
                  label: "Code Hash",
                  template: value => (
                    { id_eq: value }
                  ),
                  placeholder: "Hash..."
                }),
                textFilterOf({
                  selector: "owner",
                  label: "Owner",
                  template: value => (
                    { owner: { id_eq: value } }
                  ),
                  placeholder: "Address..."
                })
              ]
            }
            title="Codes"
          />
        </Box>
      </div>
    </>
  )
}
