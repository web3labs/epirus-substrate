import React from "react"
import { NavLink } from "react-router-dom"
import AccountsBadge from "./badges/AccountsBadge"
import ActivitiesBadge from "./badges/ActivitiesBadge"
import BlocksMenuBadge from "./badges/BlocksMenuBadge"
import CodesMenuBadge from "./badges/CodesMenuBadge"
import ContractsMenuBadge from "./badges/ContractsMenuBadge"
import { classNames } from "../utils/strings"
import HomeBadge from "./badges/HomeBadge"

export default function SideBar ({ highlight }: {highlight: number}) {
  return (
    <div className="flex flex-col w-60 content container shadow">
      <div className={classNames("flex flex-wrap items-center gap-x-1 hover:bg-slate-300 py-1 pl-5", highlight === 1 ? "bg-slate-300" : "")}>
        <div className="relative ml-2">
          <HomeBadge size={12}/>
        </div>
        <NavLink to="/" className="hover:link">
          Home
        </NavLink>
      </div>
      <div className={classNames("flex flex-wrap items-center gap-x-1 hover:bg-slate-300 py-1 pl-5", highlight === 2 ? "bg-slate-300" : "")}>
        <div className="relative ml-2">
          <AccountsBadge size={12}/>
        </div>
        <NavLink to="/accounts" className="hover:link">
          Accounts
        </NavLink>
      </div>
      <div className={classNames("flex flex-wrap items-center gap-x-1 hover:bg-slate-300 py-1 pl-5", highlight === 3 ? "bg-slate-300" : "")}>
        <div className="relative ml-2">
          <ActivitiesBadge size={12}/>
        </div>
        <NavLink to="/activities" className="hover:link">
          Activities
        </NavLink>
      </div>
      <div className={classNames("flex flex-wrap items-center gap-x-1 hover:bg-slate-300 py-1 pl-5", highlight === 4 ? "bg-slate-300" : "")}>
        <div className="relative ml-2">
          <BlocksMenuBadge size={12}/>
        </div>
        <NavLink to="/blocks" className="hover:link">
          Blocks
        </NavLink>
      </div>
      <div className={classNames("flex flex-wrap items-center gap-x-1 hover:bg-slate-300 py-1 pl-5", highlight === 5 ? "bg-slate-300" : "")}>
        <div className="relative ml-2">
          <CodesMenuBadge size={12}/>
        </div>
        <NavLink to="/codes" className="hover:link">
          Codes
        </NavLink>
      </div>
      <div className={classNames("flex flex-wrap items-center gap-x-1 hover:bg-slate-300 py-1 pl-5", highlight === 6 ? "bg-slate-300" : "")}>
        <div className="relative ml-2">
          <ContractsMenuBadge size={12}/>
        </div>
        <NavLink to="/contracts" className="hover:link">
          Contracts
        </NavLink>
      </div>
    </div>
  )
}
