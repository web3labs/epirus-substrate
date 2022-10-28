import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import React from "react"

export default function ErrorStatusView ({ codeHash }:{codeHash: string}) {
  function getErrorLogs () {
    console.log("download error logs here")
  }
  return (
    <div className="flex flex-col pt-2 my-2 mx-4">
      <div onClick={getErrorLogs} className="flex flex-row p-2 cursor-pointer justify-between items-center border rounded border-red-200 bg-red-200">
        <div className="flex gap-2">
          <ExclamationTriangleIcon className="w-5 h-5" />
          <div className="text-sm">The source code verification process exited with errors</div>
        </div>
      </div>
    </div>
  )
}
