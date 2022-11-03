import { FolderIcon } from "@heroicons/react/24/solid"
import React, { useEffect, useState } from "react"
import api from "../../../apis/verifierApi"
import FilesView from "./FilesView"
import FolderNavigation from "./FolderNavigation"
import MetadataView, { ContractMetadata } from "./MetadataView"

interface DirectoryListEntry {
  type: string
  url: string
  name: string
  size: number
  utf8: boolean
  ents?: DirectoryListEntry[]
}

export default function VerifiedView (
  { codeHash } :
  { codeHash: string }
) {
  const [metadata, setMetadata] = useState<ContractMetadata | null>(null)
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
        <FolderNavigation path={path} setPath={setPath}/>
        {
          folders &&
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            {folders.map(f => {
              return (
                <div
                  key={f.url}
                  onClick={() => setPath(f.url)}
                  className="flex gap-2 px-4 py-2 w-48 cursor-pointer items-center border rounded border-slate-300"
                >
                  <FolderIcon height={18} width={18} className="flex-shrink-0"/>
                  <div className="break-all">{f.name}</div>
                </div>
              )
            })}
          </div>
        }
        {
          files &&
          <FilesView files={files} codeHash={codeHash}/>
        }

      </div>
    </div>
  )
}
