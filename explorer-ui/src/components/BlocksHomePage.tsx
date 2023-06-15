import React from "react"
import { NavLink } from "react-router-dom"

import Box from "./commons/Box"
import BlockList from "./blocks/BlockList"

export default function HomePage () {
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
