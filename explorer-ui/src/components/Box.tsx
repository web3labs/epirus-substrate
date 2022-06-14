import React from "react"
import { con } from "../utils/strings"

interface Props {
    children: JSX.Element | JSX.Element[],
    className?: string
}

export default function Box ({ children, className }: Props) {
  return (
    <div className={con(
      "flex flex-col container w-full items-start justify-start bg-white shadow",
      className
    )}>
      {children}
    </div>
  )
}
