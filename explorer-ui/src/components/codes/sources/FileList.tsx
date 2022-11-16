import React, { useState } from "react"
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

import FileView, { SourceFile } from "./FileView"

export default function FileList (
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
    return (
      <div className="flex flex-col gap-2">
        { files.map(file => (<CollapsedFileView key={file.url} codeHash={codeHash} file={file} />)) }
      </div>)
  }

  return (
    <div className="flex flex-col gap-2">
      { files.map(file => <FileView key={file.url} codeHash={codeHash} file={file} />) }
    </div>
  )
}

function CollapsedFileView (
  { codeHash, file } :
  {
    codeHash: string,
    file: SourceFile
  }
) {
  const [open, setOpen] = useState(false)

  function toggleOpen () {
    setOpen(prev => !prev)
  }

  return (<div className="flex flex-col gap-2">
    <div className="flex gap-1 cursor-pointer items-center text-sm text-gray-500 hover:text-gray-900"
      onClick={toggleOpen}>
      {open
        ? <ChevronDownIcon className="h-4 w-4"/>
        : <ChevronRightIcon className="h-4 w-4"/> }
      <div>{file.name}</div>
    </div>
    { open &&
        <FileView key={file.url} codeHash={codeHash} file={file} />
    }
  </div>)
}
