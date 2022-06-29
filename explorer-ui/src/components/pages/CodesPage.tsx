import React from "react"
import Box from "../Box"
import Breadcrumbs from "../Breadcrumbs"
import CodeList from "../codes/CodeList"

export default function CodesPage () {
  return (
    <>
      <Breadcrumbs/>
      <Box className="content">
        <CodeList
          pageQuery={{ first: 15 }}
          sortable={true}
          title="Codes"
        />
      </Box>
    </>
  )
}
