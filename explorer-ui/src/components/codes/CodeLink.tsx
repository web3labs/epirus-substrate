import React from "react"
import { NavLink } from "react-router-dom"
import { HexText } from "../commons/Hex"

export default function CodeLink (
  { id, short = false }:{id:string, short?:boolean}
) {
  return (
    <NavLink to={`/codes/${id}`} className="link">
      <HexText short={short}>{id}</HexText>
    </NavLink>
  )
}
