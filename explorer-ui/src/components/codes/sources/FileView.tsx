import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import React, { useState, useEffect } from "react"

import hljs, { SUPPORTED_LANGS } from "../../../highlight"

import api from "../../../apis/verifierApi"
import { formatBytes } from "../../../formats/bytes"
import SourceCodeView from "./SourceCode"
import { errMsg } from "../../../utils/errors"
import FileBox from "./FileBox"

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
    try {
      resource()
    } catch (error: unknown) {
      setContent(errMsg(error))
    }
  }, [])

  if (!content || !htmlContent) {
    return <FileBox name={file.name}>
      <span className="text-gray-400 p-2">
        Empty file.
      </span>
    </FileBox>
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
  const displayText = file.utf8 ? "This file is too large to be displayed." : "Binary content is not displayed."
  const downloadLink = api.resourceDownloadLink({ codeHash, path: file.url })

  return (
    <FileBox name={file.name}
      tools={<>
        <div className="px-1">{formatBytes(file.size)}</div>
        <a href={downloadLink}
          download
          target="_blank"
          className="rounded-full p-1 hover:bg-neutral-200" rel="noreferrer">
          <ArrowDownTrayIcon height={18} width={18}/>
        </a>
      </>}>
      <span className="text-gray-400 p-2">
        {displayText}
      </span>
    </FileBox>
  )
}
