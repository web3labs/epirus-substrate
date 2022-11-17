import { ArrowDownTrayIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import React from "react"
import api from "../../../apis/verifierApi"
import { useChainProperties } from "../../../contexts/ChainContext"
import { longDateTime } from "../../../formats/time"

export default function ErrorStatusView (
  { codeHash, timestamp } :
  { codeHash: string,
    timestamp: string | undefined
  }
) {
  const { info } = useChainProperties()
  const downloadLink = api.errorLogDownloadLink({ chain: info, codeHash })

  return (
    <a href={downloadLink}
      className="flex flex-row m-4 p-2 cursor-pointer justify-between items-center border rounded border-red-100 bg-red-100"
      download>
      <div className="flex gap-2 text-sm items-center">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <div>
          <span>The source code verification process exited with errors</span>
          { timestamp && <span> on {longDateTime(new Date(timestamp))}</span>}
        </div>
      </div>
      <div className="flex gap-2 text-xs items-center">
        <span>Download logs</span>
        <ArrowDownTrayIcon height={15} width={15}/>
      </div>
    </a>
  )
}
