import React from "react"
import { NavLink } from "react-router-dom"
import { shortenHexString } from "../../formats/text"

export default function CodeLink (
  { id, short = false }:{id:string, short?:boolean}
) {
  return (
    <NavLink to={`/codes/${id}`} className="link font-mono">
      {short ? shortenHexString(id) : id}
    </NavLink>
  )
}
