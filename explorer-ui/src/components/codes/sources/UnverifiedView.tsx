import { FolderIcon, TrashIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline"
import React, { Dispatch, useState, useCallback } from "react"
import { FileRejection, useDropzone, FileError } from "react-dropzone"
import { Link } from "react-router-dom"
import { SourceTabAction } from "../../../types/componentStates"
import { formatBytes } from "../../../formats/bytes"
import api from "../../../apis/verifierApi"
import { useChainProperties } from "../../../contexts/ChainContext"

export default function UnverifiedView (
  { codeHash, dispatch } :
  {
    codeHash: string,
    dispatch: Dispatch<SourceTabAction>
  }
) {
  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [file, setFile] = useState<File>()
  const [fileRejection, setFileRejection] = useState<FileRejection>()
  const { info } = useChainProperties()

  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles !== undefined && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setFileRejection(undefined)
      setSubmitDisabled(false)
    }
  }, [])

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    if (rejections !== undefined && rejections.length > 0) {
      setFileRejection(rejections[0])
      setFile(undefined)
      setSubmitDisabled(true)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    accept: {
      "application/zip": [],
      "application/gzip": [],
      "application/x-bzip": []
    }
  })

  function uploadFileToVerifier () {
    dispatch({ type: "uploading" })

    if (file === undefined) {
      throw new Error("File is undefined")
    }
    const formData = new FormData()
    formData.append("File", file)

    api.verify({ chain: info, codeHash }, formData)
      .then(response => response.json())
      .then(data => {
        setTimeout(() => dispatch({ type: "uploaded" }), 10)
      })
      .catch(error => {
        dispatch({ type: "networkError", error })
      })
  }

  function removeFileToUpload () {
    setFile(undefined)
    setSubmitDisabled(true)
  }

  return (
    <div className="flex flex-col p-2 my-2 mx-4">
      <div className="text-gray-900 font-semibold">Upload Source Files for Verification</div>
      <div className="text-gray-900 text-sm py-2">We will add simple instructions on source code upload here plus a <Link to="route" target="_blank" rel="noopener noreferrer" className="text-blue-500">link</Link> to a detailed tutorial</div>
      { !file && <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="flex flex-col p-4 my-2 border border-gray-200 rounded text-gray-500 w-full h-60 justify-center items-center">
          <ArrowUpTrayIcon className="h-7 w-7"/>
          <span>Click to select or drag and drop to upload file</span>
        </div>
      </div>}
      { file &&
        <div className="flex flex-col gap-6 rounded p-4 my-2 bg-gray-100 w-48">
          <div className="flex gap-2 text-sm">
            <FolderIcon className="w-5 h-5"/>
            <div>{file.name}</div>
          </div>
          <div className="flex gap-2 text-xs justify-between items-end">
            <div>{formatBytes(file.size)}</div>
            <button type="button" onClick={removeFileToUpload}>
              <TrashIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
      }
      { fileRejection &&
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2 text-sm text-red-800">
            <span>{fileRejection.file.name} cannot be uploaded</span>
            {fileRejection.errors.map((error : FileError) => {
              const key = `${fileRejection.file.name}-${error.code}`
              return (<span key={key}>{error.message}</span>)
            })}
          </div>
        </div>
      }
      <button type="button" onClick={uploadFileToVerifier} disabled={submitDisabled} className="py-2 my-2 border rounded border-emerald-600 bg-emerald-600 text-white font-semibold disabled:bg-emerald-200 disabled:border-emerald-200">
        Verify Contract
      </button>
    </div>
  )
}
