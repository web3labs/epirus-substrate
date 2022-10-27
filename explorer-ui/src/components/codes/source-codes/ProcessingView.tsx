import { ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import React, { Dispatch, useEffect, useState } from "react"
import { useChainProperties } from "../../../contexts/ChainContext"
import { SourceTabAction } from "../../../types/componentStates"
import api from "./verifierApi"

export default function ProcessingView (
  {
    id,
    dispatch
  } : {
    id: string,
    dispatch: Dispatch<SourceTabAction>
  }
) {
  const { info } = useChainProperties()
  const [lines, setLines] = useState<string[]>([])
  const [outcome, setOutcome] = useState("error")
  const [socketClosed, setSocketClosed] = useState(false)

  useEffect(() => {
    // TODO: Extract WS endpoint to env
    const socket = api.tailWebsocket({ chain: info, codeHash: id })

    // Listen for messages
    socket.addEventListener("message", ({ data }) => {
      if (typeof data === "string") {
        if (data.length > 0 && data.charAt(0) === "✅") {
          setOutcome("success")
        }
        setLines(prevState => (prevState.concat(data)))
      }
    })

    // Connection closed
    socket.addEventListener("close", (event) => {
      setSocketClosed(true)
    })
  }, [id])

  function dispatchError () {
    dispatch({ type: "verificationError" })
  }

  function dispatchSuccess () {
    dispatch({ type: "verificationSuccess" })
  }

  return (
    <div className="p-2 m-2">
      {
        (socketClosed && outcome === "success") &&
        <div className="flex justify-between items-center font-semibold text-sm">
          <div className="text-green-600">Verification successful!</div>
          <button type="button" onClick={dispatchSuccess} >
            <div className="flex gap-1 text-gray-800 items-center">
              <ArrowRightIcon className="w-5 h-5"/>
              <div className="font-semibold text-sm">See verified sources</div>
            </div>
          </button>
        </div>
      }
      {
        (socketClosed && outcome === "error") &&
        <div className="flex justify-between items-center font-semibold text-sm">
          <div className="text-red-600">Verification exited with errors.</div>
          <button type="button" onClick={dispatchError} >
            <div className="flex gap-1 text-gray-800 items-center">
              <ArrowPathIcon className="w-5 h-5"/>
              <div className="font-semibold text-sm">Retry</div>
            </div>
          </button>
        </div>
      }
      {
        !socketClosed &&
        <div className="font-semibold text-sm">Your sources are being verified.</div>
      }
      <textarea className="mt-2 p-4 h-60 rounded border border-gray-300 bg-gray-50 text-gray-800 w-full text-sm font-mono" value={lines.join("")} readOnly={true}></textarea>
    </div>
  )
}
