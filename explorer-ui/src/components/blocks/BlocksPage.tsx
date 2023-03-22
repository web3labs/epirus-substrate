import React from "react"
import BlockList from "./BlockList"
import Box from "../commons/Box"
import { NavLink } from "react-router-dom"

export default function BlocksPage () {
  return (
    <div className="content flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
      <Box>
        <BlockList
          short={true}
          title={
            <NavLink to="/blocks" className="hover:link">
              Latest Blocks
            </NavLink>
          }
          description="Blocks"
        />
      </Box>
    </div>
  )
}
