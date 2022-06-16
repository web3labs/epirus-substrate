import React from "react"
import { classNames } from "../utils/strings"

const styles: Record<string, string> = {
  orange: "text-orange-600 bg-orange-200",
  neutral: "text-neutral-600 bg-neutral-200",
  lime: "text-lime-600 bg-lime-200"
}

export default function Tag ({ label, color = "neutral" }: {label:string, color?:string}) {
  return (
    <span className={classNames(
      "text-xs font-semibold inline-block py-0.5 px-1 uppercase rounded last:mr-0 mr-1",
      styles[color])}>
      {label}
    </span>
  )
}
