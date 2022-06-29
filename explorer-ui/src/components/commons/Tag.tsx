import React from "react"
import { classNames } from "../../utils/strings"

export default function Tag ({
  label
}: {label:string, color?:string}) {
  return (
    <span className={classNames(
      "tag text-xs font-semibold inline-block py-0.5 px-1 uppercase rounded last:mr-0 mr-1",
      label.toLocaleLowerCase()
    )}>
      {label}
    </span>
  )
}
