import React from "react"
import { NavLink } from "react-router-dom"

import ActivityList from "../activities/ActivityList"
import Box from "../commons/Box"
import ContractList from "../contracts/ContractList"

export default function HomePage () {
  return (
    <div className="content flex flex-col space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-2">
      <Box>
        <ActivityList
          short={true}
          pageQuery={{ first: 6 }}
          title={
            <NavLink to="/activities" className="hover:link">
            Latest Activities
            </NavLink>
          }
          description="Contract related activities"
        />
      </Box>
      <Box>
        <ContractList
          short={true}
          title={
            <NavLink to="/contracts" className="hover:link">
            Latest Contracts
            </NavLink>
          }
          description="Contracts deployed"
        />
      </Box>
    </div>
  )
}
