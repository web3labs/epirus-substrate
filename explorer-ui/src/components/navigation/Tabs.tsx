import React, { ReactElement } from "react"
import { NavLink, Route, Routes } from "react-router-dom"

export interface TabQuery {
  currentId?:string,
  where: any
}

export interface TabItem {
    to: string,
    label: string,
    element: ReactElement
}

export default function Tabs ({
  items
}: {items: TabItem[]}) {
  return (
    <>
      <div className="border-b border-gray-200 w-full">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
          {items.map(({ label, to }) => (
            <li className="mr-2" key={label}>
              <NavLink to={to}
                end={true}
                className="group tab">
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full">
        <Routes>
          {items.map(({ label, to, element }) => (
            to === ""
              ? <Route key={label} index element={element} />
              : <Route key={label} path={to} element={element} />
          ))}
        </Routes>
      </div>
    </>
  )
}
