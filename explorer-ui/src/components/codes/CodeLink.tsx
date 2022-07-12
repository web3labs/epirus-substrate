import React from "react"
import { NavLink } from "react-router-dom"
import CodeHash from "./CodeHash"

export default function CodeLink (
  { id, short = true }:{ id:string, short?:boolean }
) {
  return (
    <NavLink to={`/codes/${id}`} className="link">
      <CodeHash hash={id} short={short} />
    </NavLink>
  )
}
