import { ChevronRightIcon, FolderIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from "react"
import api from "../../../apis/verifierApi"
import { classNames } from "../../../utils/strings"
import FileView from "./FileView"
import MetadataView, { ContractMetadata } from "./MetadataView"

interface DirectoryListEntry {
  type: string
  url: string
  name: string
  size: number
  ents?: DirectoryListEntry[]
}

export default function VerifiedView ({ codeHash } : { codeHash: string }) {
  const [metadata, setMetadata] = useState<ContractMetadata | null>(null)
  // const [rootDirectory, setRootDirectory] = useState<DirectoryListEntry[] | null>(null)
  const [path, setPath] = useState("")
  const [currentDirectory, setCurrentDirectory] = useState<DirectoryListEntry[] | null>(null)

  useEffect(() => {
    async function fetchData () {
      try {
        const metadata = await api.metadata(codeHash) as ContractMetadata
        setMetadata(metadata)
      } catch (error) {
        // TODO: handle error
        console.log(error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    async function setCurrent () {
      const dirList = await api.directoryList(codeHash) as DirectoryListEntry[]
      if (path === "") {
        setCurrentDirectory(dirList)
        return
      }
      const pathList = path.split("/")

      // how to find current dir by path in nested root dir
      const current = pathList.reduce((dir, path, index) => {
        const subdir = dir && dir.find(d => d.name === path)
        if (!subdir?.ents) {
          throw new Error("Cannot find sub-directory")
        }
        return subdir.ents
      }, dirList)
      setCurrentDirectory(current)
    }
    setCurrent()
  }, [path])

  const folders = currentDirectory?.filter(item => item.type === "dir")
  const files = currentDirectory?.filter(item => item.type === "file")

  return (
    <div className="p-4 flex flex-col gap-2 min-h-screen">
      { metadata &&
        <MetadataView metadata={metadata}/>
      }
      <div className="flex flex-col gap-2 text-gray-500">
        <div className="py-2 text-sm font-semibold">Source Code</div>
        <FolderBreadCrumbs path={path} setPath={setPath}/>
        {
          folders &&
          <div className="flex gap-4 text-sm text-gray-700">
            {folders.map(f => {
              return (
                <div key={f.url} className="flex gap-2 px-4 py-2 w-48 cursor-pointer items-center border rounded border-slate-300" onClick={() => setPath(f.url)}>
                  <FolderIcon height={18} width={18} />
                  {f.name}
                </div>
              )
            })}
          </div>
        }
        {
          files &&
          <div className="flex flex-col gap-2">
            {files.map(file => {
              return <FileView key={file.url} codeHash={codeHash} file={file} />
            })}
          </div>
        }

      </div>
    </div>
  )
}

function FolderBreadCrumbs ({ path, setPath } : {path: string, setPath: (p: string) => void}) {
  // If path is at root, don't show breadcrumbs
  if (path === "") {
    return <></>
  }
  const pathList = path.split("/")
  const crumbs = pathList.map((p, i) => {
    const url = pathList.slice(0, i + 1).join("/")
    console.log(url)
    return {
      name: p,
      navigate: () => setPath(url)
    }
  })

  crumbs.unshift({
    name: "root",
    navigate: () => setPath("")
  })

  return (
    <div className="flex gap-2">
      {
        crumbs.map((c, i) => {
          const isNotLast = i < crumbs.length - 1
          return (
            <div key={c.name} className="flex gap-1 items-center">
              <div onClick={c.navigate} className={classNames(
                isNotLast ? "text-blue-500 cursor-pointer" : "text-gray-700",
                "text-sm"
              )}>{c.name}</div>
              { isNotLast && <ChevronRightIcon height={15} width={15} className="text-gray-700"/>}
            </div>
          )
        })
      }
    </div>
  )
}
