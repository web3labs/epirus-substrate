import React from "react"

export function Heading () {
  return (
    <div className="mt-8 h-4 gradient-purple-pink-red w-4/5"></div>
  )
}

export function Text () {
  return (
    <div className="my-4">
      <div className="h-3 my-3 gradient-purple-pink-red w-4/6"></div>
      <div className="h-3 my-3 gradient-purple-pink-red w-3/6"></div>
      <div className="h-3 my-3 gradient-purple-pink-red w-2/6"></div>
    </div>
  )
}

export default function Skeleton ({ children }: {children: JSX.Element | JSX.Element[]}) {
  return (
    <div className="animate-pulse">
      {children}
    </div>
  )
}
