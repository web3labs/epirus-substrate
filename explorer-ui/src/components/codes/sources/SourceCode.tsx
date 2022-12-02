import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"

import { classNames } from "../../../utils/strings"
import Copy from "../../commons/Copy"
import FileBox from "./FileBox"

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
    <FileBox name={name}
      tools={<>
        <Copy text={content}/>
        <div
          data-testid="expand-sourcecode"
          className="rounded-full p-1 cursor-pointer hover:bg-neutral-200">
          {
            expanded
              ? <ArrowsPointingInIcon width={18} height={18} onClick={toggleExpanded}/>
              : <ArrowsPointingOutIcon width={18} height={18} onClick={toggleExpanded}/>
          }
        </div>
      </>}>
      <pre className={classNames(
        expanded ? "" : "break-normal max-h-80",
        "github p-3 overflow-y-auto scroll-smooth"
      )}>
        <code dangerouslySetInnerHTML={{ __html: htmlContent }}/>
      </pre>
    </FileBox>
  )
}
