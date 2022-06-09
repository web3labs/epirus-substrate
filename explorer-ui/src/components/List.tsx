import React from "react"

interface Props {
    title: string,
    description?: string,
    items: JSX.Element[]
}

export default function List ({ title, description, items }: Props) {
  return (
        <div className="flex flex-col container w-full items-center justify-center bg-white shadow">
            <div className="flex flex-col w-full p-4 border-b px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
                {description &&
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{description}</p>
                }
            </div>
            <ul className="flex flex-col divide-y w-full">
                {items}
            </ul>
        </div>
  )
}
