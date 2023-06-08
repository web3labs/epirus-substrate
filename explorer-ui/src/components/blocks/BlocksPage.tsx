import React from "react"
import BlockList from "./BlockList"
import Box from "../commons/Box"
import { NavLink } from "react-router-dom"
import SideBar from "../navigation/SideBar"
import Breadcrumbs from "../navigation/Breadcrumbs"

export default function BlocksPage () {
  return (
    <>
      <Breadcrumbs/>
      <div className="flex flex-row gap-2 mt-2">
        <SideBar highlight={3}/>
        <Box>
          <BlockList
            short={true}
            title={
              <NavLink to="/blocks" className="hover:link">
                Latest Blocks
              </NavLink>
            }
          />
        </Box>
      </div>
    </>
  )
}
