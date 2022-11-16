import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import React, { useState, useEffect } from "react"

import hljs from "highlight.js/lib/core"
import "highlight.js/styles/github.css"

import api from "../../../apis/verifierApi"
import { formatBytes } from "../../../formats/bytes"
import SourceCodeView from "./SourceCode"

const SUPPORTED_LANGS = ["rust", "rs", "toml", "json", "text"]

export interface SourceFile {
  type: string
  url: string
  name: string
  size: number
  utf8: boolean
}

export default function FileView (
  { codeHash, file } :
  {
    codeHash: string,
    file: SourceFile
  }
) {
  if (!file.utf8 || file.size > 500000) {
    return <DownloadFileView key={file.url} file={file} codeHash={codeHash}/>
  }

  const [content, setContent] = useState<string | undefined>()
  const [htmlContent, setHtmlContent] = useState<string | undefined>()

  useEffect(() => {
    async function resource () {
      const rsc = await api.resource({ codeHash, path: file.url })
      if (rsc.ok) {
        const text = await rsc.text()
        const { value } = hljs.highlightAuto(
          text, SUPPORTED_LANGS
        )

        setContent(text)
        setHtmlContent(value)
      } else {
        const { message } = await rsc.json()
        setContent(`Unable to fetch file due to error [${message}]`)
      }
    }
    resource()
  }, [])

  if (!content || !htmlContent) {
    return <></>
  }

  return (
    <SourceCodeView
      name={file.name}
      content={content}
      htmlContent={htmlContent}
    />
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
      <div className="my-2 border border-neutral-200 text-xs font-mono">
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
