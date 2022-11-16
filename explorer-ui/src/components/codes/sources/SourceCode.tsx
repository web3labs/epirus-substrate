import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"

import { classNames } from "../../../utils/strings"
import Copy from "../../commons/Copy"

export default function SourceCodeView (
  { name, content, htmlContent } :
  {
    name: string,
    content: string,
    htmlContent: string
  }
) {
  const [expanded, setExpanded] = useState(false)

  function toggleExpanded () {
    setExpanded(prev => !prev)
  }

  return (
    <div>
      <div className="my-2 border border-neutral-200 text-xs">
        <div className="p-2 flex justify-between bg-neutral-100 items-center">
          <div className="font-mono">{name}</div>
          <div className="flex gap-1 items-center">
            <Copy text={content}/>
            <div className="rounded-full p-1 cursor-pointer hover:bg-neutral-200">
              {
                expanded
                  ? <ArrowsPointingInIcon width={18} height={18} onClick={toggleExpanded}/>
                  : <ArrowsPointingOutIcon width={18} height={18} onClick={toggleExpanded}/>
              }
            </div>
          </div>
        </div>
        <pre className={classNames(
          expanded ? "" : "break-normal max-h-80",
          "github p-3 overflow-y-auto scroll-smooth"
        )}>
          <code dangerouslySetInnerHTML={{ __html: htmlContent }}/>
        </pre>
      </div>
    </div>
  )
}
