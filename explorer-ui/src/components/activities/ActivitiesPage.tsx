import React from "react"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { textFilterOf } from "../query/filters/TextFilter"
import ActivityList, { ACTIVITY_SORT_OPTIONS } from "./ActivityList"

export default function ActivitiesPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <ActivityList
          pageQuery={{
            first: 15,
            orderBy: "createdAt_DESC"
          }}
          sortOptions={ACTIVITY_SORT_OPTIONS}
          filterTypes={[
            DateRangeFilter,
            textFilterOf(
              {
                selector: "from",
                label: "From",
                template: value => (
                  { from: { id_eq: value } }
                ),
                placeholder: "Address..."
              }
            )
          ]}
          title="Activities"
        />
      </Box>
    </>
  )
}
