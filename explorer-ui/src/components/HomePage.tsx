import React from "react"
import { NavLink } from "react-router-dom"

import ActivityList from "./activities/ActivityList"
import Box from "./commons/Box"
import ContractList from "./contracts/ContractList"
import AccountsBadge from "./badges/AccountsBadge"
import ActivitiesBadge from "./badges/ActivitiesBadge"
import BlocksMenuBadge from "./badges/BlocksMenuBadge"
import CodesMenuBadge from "./badges/CodesMenuBadge"
import ContractsMenuBadge from "./badges/ContractsMenuBadge"

export default function HomePage () {
  return (
    <div className="content flex flex-row space-y-4 md:space-y-0 md:gap-2">
      <div className="flex flex-col w-60 container bg-over shadow">
        <div className="flex flex-wrap items-center gap-x-1 hover:bg-slate-300">
          <div className="relative ml-2">
            <AccountsBadge size={12}/>
          </div>
          <NavLink to="/accounts" className="hover:link">
            Accounts
          </NavLink>
        </div>
        <div className="flex flex-wrap items-center gap-x-1 hover:bg-slate-300">
          <div className="relative ml-2">
            <ActivitiesBadge size={12}/>
          </div>
          <NavLink to="/activities" className="hover:link">
            Activities
          </NavLink>
        </div>
        <div className="flex flex-wrap items-center gap-x-1 hover:bg-slate-300">
          <div className="relative ml-2">
            <BlocksMenuBadge size={12}/>
          </div>
          <NavLink to="/blocks" className="hover:link">
            Blocks
          </NavLink>
        </div>
        <div className="flex flex-wrap items-center gap-x-1 hover:bg-slate-300">
          <div className="relative ml-2">
            <CodesMenuBadge size={12}/>
          </div>
          <NavLink to="/codes" className="hover:link">
            Codes
          </NavLink>
        </div>
        <div className="flex flex-wrap items-center gap-x-1 hover:bg-slate-300">
          <div className="relative ml-2">
            <ContractsMenuBadge size={12}/>
          </div>
          <NavLink to="/contracts" className="hover:link">
            Contracts
          </NavLink>
        </div>
      </div>
      <Box>
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
