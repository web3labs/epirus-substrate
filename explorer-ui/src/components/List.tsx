import React from "react"

interface Props {
    header?: JSX.Element
    children: JSX.Element | JSX.Element[]
}

export function ListHeader ({ title, description }: {title:string, description?: string}) {
  return (
    <div className="flex flex-col w-full p-4 border-b px-4 py-5 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
      {description &&
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
      }
    </div>
  )
}

export default function List ({ header, children }: Props) {
  return (
    <div className="flex flex-col container w-full items-center justify-center bg-white shadow">
      {header}
      <ul className="flex flex-col divide-y w-full">
        {children}
      </ul>
    </div>
  )
}
