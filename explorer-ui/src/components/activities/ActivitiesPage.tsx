import React from "react"
import Box from "../commons/Box"
import Breadcrumbs from "../navigation/Breadcrumbs"
import ActivityList from "./ActivityList"

export default function ActivitiesPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <ActivityList
          pageQuery={{ first: 15 }}
          sortable={true}
          title="Activities"
        />
      </Box>
    </>
  )
}
