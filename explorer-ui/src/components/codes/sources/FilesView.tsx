import React, { useEffect, useState } from "react"
import hljs from "highlight.js"
import "highlight.js/styles/github.css"
import api from "../../../apis/verifierApi"
import { classNames } from "../../../utils/strings"
import { ArrowDownTrayIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import Copy from "../../commons/Copy"
import { formatBytes } from "../../../formats/bytes"

interface SourceFile {
  type: string
  url: string
  name: string
  size: number
  utf8: boolean
}

export default function FilesView (
  { files, codeHash } :
  {
    files: SourceFile[],
    codeHash: string
  }
) {
  if (files.length === 0) {
    return <div>This folder does not contain any files.</div>
  }
  if (files.length > 10) {
    return <div>Too many files!</div>
  }

  return (
    <div className="flex flex-col gap-2">
      {files.map(file => {
        if (!file.utf8 || file.size > 500000) {
          return <DownloadFileView key={file.url} file={file} codeHash={codeHash}/>
        } else {
          return <FileView key={file.url} codeHash={codeHash} file={file} />
        }
      })}
    </div>
  )
}

function DownloadFileView (
  { codeHash, file } :
  {
    codeHash: string,
    file: SourceFile
  }
) {
  const displayText = file.utf8 ? "This file is too large to be displayed." : "Binary file display is not supported."

  async function downloadFile () {
    const rsc = await api.resource({ codeHash, path: file.url })
    const blob = await rsc.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute(
      "download",
      file.name
    )

    // Append to html link element page
    document.body.appendChild(link)

    // Start download
    link.click()
  }

  return (
    <div>
      <div className="my-2 border border-neutral-200 rounded text-xs font-mono">
        <div className="p-2 flex justify-between bg-neutral-100 items-center">
          <div>{file.name}</div>
          <div className="flex gap-1 items-center">
            <div className="px-1">{formatBytes(file.size)}</div>
            <button type="button" onClick={downloadFile} className="rounded-full p-1 hover:bg-neutral-200">
              <ArrowDownTrayIcon height={18} width={18}/>
            </button>
          </div>
        </div>
        <div className="p-2 flex flex-col gap-1 items-center">
          <div>{displayText}</div>
        </div>
      </div>
    </div>
  )
}

function FileView (
  { codeHash, file } :
  {
    codeHash: string,
    file: SourceFile
  }
) {
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState<string | undefined>()

  useEffect(() => {
    async function resource () {
      const rsc = await api.resource({ codeHash, path: file.url })
      if (rsc.ok) {
        const text = await rsc.text()
        const { value } = hljs.highlightAuto(text, ["rust", "rs", "toml", "json", "text"])

        setContent(value)
      } else {
        const { message } = await rsc.json()
        setContent(`Unable to fetch file due to error [${message}]`)
      }
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
          <div className="font-mono">{file.name}</div>
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
          "github p-2 overflow-y-auto scroll-smooth"
        )}>
          <code dangerouslySetInnerHTML={{ __html: content }}/>
        </pre>
      </div>
    </div>
  )
}
