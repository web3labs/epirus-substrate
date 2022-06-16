import React from "react"
import { NavLink } from "react-router-dom"
import useBreadcrumbs from "use-react-router-breadcrumbs"

export default function Breadcrumbs () {
  const breadcrumbs = useBreadcrumbs()

  console.log(breadcrumbs)
  const links = breadcrumbs.slice(0, breadcrumbs.length - 1)
  const current = breadcrumbs[breadcrumbs.length - 1]

  return (
    <ol className="list-reset flex flex-row gap-x-2 text-sm mt-2">
      {links.map(({ match, breadcrumb }) => (
        <li key={match.pathname}>
          <NavLink to={match.pathname} className="link">{breadcrumb}</NavLink>
          <span className="text-gray-400 ml-2 select-none">/</span>
        </li>
      ))}
      <li>
        <span className="text-gray-600 overflow-hidden text-ellipsis">{current.breadcrumb}</span>
      </li>
    </ol>
  )
}
