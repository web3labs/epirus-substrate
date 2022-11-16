import React, { useEffect, useState } from "react"
import { FolderIcon, FolderOpenIcon } from "@heroicons/react/24/outline"

import api from "../../../apis/verifierApi"
import { errMsg } from "../../../utils/errors"
import { classNames } from "../../../utils/strings"
import { Warning } from "../../commons/Alert"
import FileList from "./FileList"

interface DirectoryListEntry {
  type: string
  url: string
  name: string
  size: number
  utf8: boolean
  ents?: DirectoryListEntry[]
}

function SourcesBreadCrumbs (
  { path, setPath }:
  {path: string,
  setPath: (path: string) => void}
) {
  const crumbs = [{
    name: "Sources Root",
    navigate: () => setPath("")
  }]

  if (path.length > 0) {
    const pathList = path.split("/")
    crumbs.push(...pathList.map(
      (p, i) => {
        const url = pathList.slice(0, i + 1).join("/")

        return {
          name: p,
          navigate: () => setPath(url)
        }
      }
    ))
  }

  return (
    <nav className="flex"
      aria-label="Sources Navigation">
      <ol className="inline-flex items-center space-x-1">
        {
          crumbs.map((c, i) => {
            const isFirst = i === 0
            const isNotLast = i !== crumbs.length - 1
            return (
              <li
                key={c.name}
                className="inline-flex items-center">
                <div
                  onClick={c.navigate}
                  className={classNames(
                    isNotLast
                      ? "text-blue-500 cursor-pointer"
                      : "font-semibold text-gray-700",
                    isFirst ? "flex gap-x-1" : "",
                    "text-sm"
                  )}>
                  {isFirst &&
                  <FolderOpenIcon height={18} width={18} className="flex-shrink-0"/>
                  }
                  {c.name}
                </div>
                { isNotLast &&
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                }
              </li>
            )
          })
        }
      </ol>
    </nav>
  )
}

export default function FilesNavigation (
  { codeHash } : { codeHash: string }
) {
  const [error, setError] = useState<string | null>(null)
  const [path, setPath] = useState("")
  const [currentDirectory, setCurrentDirectory] = useState<DirectoryListEntry[] | null>(null)

  useEffect(() => {
    async function setCurrent () {
      const dirList = await api.directoryList(codeHash) as DirectoryListEntry[]
      if (path === "") {
        setCurrentDirectory(dirList)
        return
      }
      const pathList = path.split("/")

      // TODO review
      // how to find current dir by path in nested root dir
      const current = pathList.reduce((dir, path, index) => {
        const subdir : DirectoryListEntry | undefined = dir && dir.find(d => d.name === path)
        if (!subdir?.ents) {
          throw new Error("Cannot find sub-directory")
        }
        return subdir.ents
      }, dirList)
      setCurrentDirectory(current)
    }
    try {
      setCurrent()
    } catch (error: unknown) {
      setError(errMsg(error))
    }
  }, [path])

  if (error !== null) {
    return <Warning title="Error" message={error} />
  }

  const folders = currentDirectory?.filter(item => item.type === "dir")
  const files = currentDirectory?.filter(item => item.type === "file")

  return (
    <div className="flex flex-col gap-2 p-4 mt-5 border-t">
      <SourcesBreadCrumbs path={path} setPath={setPath}/>
      {
        (folders && folders.length > 0) &&
            <div className="flex flex-col border mt-2">
              <div className="bg-neutral-100 text-xs px-2 py-3">Folders</div>
              <div className="flex flex-wrap gap-2 text-sm text-blue-500 py-4 divide-x">
                {folders.map(f => {
                  return (
                    <div
                      key={f.url}
                      onClick={() => setPath(f.url)}
                      className="flex gap-2 px-4 cursor-pointer items-center"
                    >
                      <FolderIcon height={18} width={18} className="flex-shrink-0"/>
                      <div className="break-all">{f.name}</div>
                    </div>
                  )
                })}
              </div>
            </div>
      }
      {
        files &&
          <FileList files={files} codeHash={codeHash}/>
      }
    </div>
  )
}
