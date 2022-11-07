import { ArrowDownTrayIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import React from "react"
import api from "../../../apis/verifierApi"
import { useChainProperties } from "../../../contexts/ChainContext"

export default function ErrorStatusView (
  { codeHash } :
  { codeHash: string }
) {
  const { info } = useChainProperties()

  async function getErrorLogs () {
    const logs = await api.errorLogs({ chain: info, codeHash })
    const blob = await logs.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute(
      "download",
      "error.log"
    )

    // Append to html link element page
    document.body.appendChild(link)

    // Start download
    link.click()
  }
  return (
    <div onClick={getErrorLogs} className="flex flex-row m-4 p-2 cursor-pointer justify-between items-center border rounded border-red-100 bg-red-100">
      <div className="flex gap-2 text-sm items-center">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <span>The source code verification process exited with errors</span>
      </div>
      <div className="flex gap-2 text-xs items-center">
        <span>Download logs</span>
        <ArrowDownTrayIcon height={15} width={15}/>
      </div>
    </div>
  )
}
