import React from "react"
import { ActivityType } from "../../types/contracts"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import DateRangeFilter from "../query/filters/DateRangeFilter"
import { enumTypeFilterOf, SelectionInput } from "../query/filters/EnumTypeFilter"
import { textFilterOf } from "../query/filters/TextFilter"
import ActivityList, { ACTIVITY_SORT_OPTIONS } from "./ActivityList"

export default function ActivitiesPage () {
  const activityTypes: SelectionInput[] = Object.values(ActivityType).map(type => {
    switch (type) {
    case ActivityType.CONTRACT:
      return { label: "Contract instantiate", value: type }
    case ActivityType.CONTRACTCALL:
      return { label: "Contract call", value: type }
    case ActivityType.CODESTORED:
      return { label: "Code stored", value: type }
    case ActivityType.CODEUPDATED:
      return { label: "Code upgrade", value: type }
    case ActivityType.CONTRACTTERMINATE:
      return { label: "Contract terminate", value: type }
    default:
      return type
    }
  })

  activityTypes.splice(0, 0, { label: "All types", value: "" })

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
            ),
            enumTypeFilterOf(
              {
                selector: "type",
                label: "Type",
                template: value => (
                  { type_eq: value }
                ),
                inputValues: activityTypes
              }
            )
          ]}
          title="Activities"
        />
      </Box>
    </>
  )
}
