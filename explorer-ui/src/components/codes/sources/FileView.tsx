import React, { useEffect, useState } from "react"
import hljs from "highlight.js"
import "highlight.js/styles/github.css"
import api from "../../../apis/verifierApi"
import { classNames } from "../../../utils/strings"
import { ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import Copy from "../../commons/Copy"

interface SourceFile {
  type: string
  url: string
  size: number
}

export default function FileView ({ codeHash, file } : { codeHash: string, file: SourceFile}) {
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState<string | undefined>()

  useEffect(() => {
    async function resource () {
      const rsc = await api.resource({ codeHash, path: file.url })
      const { value } = hljs.highlightAuto(rsc, ["rust", "rs", "toml", "json", "text"])

      setContent(value)
    }
    resource()
  }, [])

  function toggleExpanded () {
    setExpanded(prev => !prev)
  }

  if (!content) {
    return <></>
  }

  return (
    <div>
      <div className="my-2 border border-neutral-200 rounded text-xs">
        <div className="p-2 flex justify-between bg-neutral-100 items-center">
          <div className="font-mono">{file.url}</div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <Copy text={content}/>
            <div className="bg-neutral-100 rounded-full p-1 cursor-pointer hover:bg-neutral-200">
              {
                expanded
                  ? <ArrowsPointingInIcon width={18} height={18} onClick={toggleExpanded}/>
                  : <ArrowsPointingOutIcon width={18} height={18} onClick={toggleExpanded}/>
              }
            </div>
          </div>
        </div>
        <pre className={classNames(
          expanded ? "" : "break-normal max-h-80 overflow-y-auto scroll-smooth",
          "github p-2"
        )}>
          <code dangerouslySetInnerHTML={{ __html: content }}/>
        </pre>
      </div>
    </div>
  )
}
