import React from "react"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { classNames } from "../../../utils/strings"

export default function FolderNavigation (
  { path, setPath } :
  {
    path: string,
    setPath: (p: string) => void
  }
) {
  // If path is at root, don't show breadcrumbs
  if (path === "") {
    return <></>
  }

  const pathList = path.split("/")
  const crumbs = pathList.map((p, i) => {
    const url = pathList.slice(0, i + 1).join("/")

    return {
      name: p,
      navigate: () => setPath(url)
    }
  })

  crumbs.unshift({
    name: "root",
    navigate: () => setPath("")
  })

  return (
    <div className="flex gap-2">
      {
        crumbs.map((c, i) => {
          const isNotLast = i < crumbs.length - 1
          return (
            <div key={c.name} className="flex gap-1 items-center">
              <div
                onClick={c.navigate}
                className={classNames(
                  isNotLast ? "text-blue-500 cursor-pointer" : "text-gray-700",
                  "text-sm"
                )}>
                {c.name}
              </div>
              { isNotLast && <ChevronRightIcon height={15} width={15} className="text-gray-700"/>}
            </div>
          )
        })
      }
    </div>
  )
}
