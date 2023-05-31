import React from "react"
import { NavLink } from "react-router-dom"

import ActivityList from "./activities/ActivityList"
import Box from "./commons/Box"
import ContractList from "./contracts/ContractList"
import SideBar from "./SideBar"

export default function HomePage () {
  return (
    <div className="content flex flex-row space-y-4 md:space-y-0 md:gap-2">
      <SideBar highlight={1}/>
      <Box isContainer={false} >
        <ActivityList
          short={true}
          title={
            <NavLink to="/activities" className="hover:link">
            Latest Activities
            </NavLink>
          }
          description="Contract related activities"
        />
      </Box>
      <Box isContainer={false}>
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
