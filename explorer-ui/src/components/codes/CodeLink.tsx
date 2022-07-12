import React from "react"
import { NavLink } from "react-router-dom"
import { AddressText } from "../commons/Text"

export default function CodeLink (
  { id, short = true }:{id:string, short?:boolean}
) {
  return (
    <NavLink to={`/codes/${id}`} className="link">
      <AddressText address={id} short={short} />
    </NavLink>
  )
}
