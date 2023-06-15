import React from "react"
import { NavLink } from "react-router-dom"
import useBreadcrumbs, { BreadcrumbMatch } from "use-react-router-breadcrumbs"
import { shortenStart } from "../../formats/text"

function ShortBreadcrumb ({ match }: {match: BreadcrumbMatch<string>}) {
  return (
    <span className="font-mono">{shortenStart(match.params?.id)}</span>
  )
}

const routes = [
  { path: "accounts/:id", breadcrumb: ShortBreadcrumb },
  { path: "contracts/:id", breadcrumb: ShortBreadcrumb },
  { path: "codes/:id", breadcrumb: ShortBreadcrumb },
  { path: "blocks/:id", breadcrumb: ShortBreadcrumb }
]

export default function Breadcrumbs () {
  const breadcrumbs = useBreadcrumbs(routes)

  const links = breadcrumbs.slice(0, breadcrumbs.length - 1)
  const current = breadcrumbs[breadcrumbs.length - 1]

  return (
    <ol className="list-reset flex flex-row gap-x-2 ml-4 text-sm mt-2 overflow-hidden">
      {links.map(({ match, breadcrumb }) => (
        <li key={match.pathname}>
          <NavLink to={match.pathname} className="link">
            {breadcrumb}
          </NavLink>
          <span className="text-gray-400 ml-2 select-none">/</span>
        </li>
      ))}
      <li>
        <span className="text-gray-600 text-ellipsis">
          {current.breadcrumb}
        </span>
      </li>
    </ol>
  )
}
