import React from "react"
import { classNames } from "../../utils/strings"
import {
  ArrowTrendingUpIcon,
  Square3Stack3DIcon,
  CodeBracketIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  UsersIcon
} from "@heroicons/react/24/outline"

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon, current: false },
  { name: "Accounts", href: "/accounts", icon: UsersIcon, current: false },
  { name: "Activities", href: "/activities", icon: ArrowTrendingUpIcon, current: false },
  { name: "Blocks", href: "/blocks", icon: Square3Stack3DIcon, current: false },
  { name: "Codes", href: "/codes", icon: CodeBracketIcon, current: false },
  { name: "Contracts", href: "/contracts", icon: DocumentDuplicateIcon, current: false }
]

export default function SideBar ({ highlight }: {highlight: number}) {
  if (highlight >= 0 && highlight <= 5) {
    navigation.forEach((e) => { e.current = false })
    navigation[highlight].current = true
  }
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name} data-testid={item.name}>
                  <a
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
