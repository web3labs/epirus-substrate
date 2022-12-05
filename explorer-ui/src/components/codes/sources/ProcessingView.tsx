import React, { useEffect, useState } from "react"

import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { InformationCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/solid"

import api from "../../../apis/verifierApi"
import { SourceTabProps } from "./SourceTab"

interface LogMessage {
  type: "LOG",
  data: string
}

interface EndOfLog {
  type: "EOT",
  data: boolean
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>
class AutoScrollingTextarea extends React.Component<TextareaProps, {}> {
  element: HTMLTextAreaElement|null = null

  componentDidMount () {
    if (this.element) {
      this.element.scrollTop = this.element.scrollHeight
    }
  }

  componentDidUpdate (prevProps: TextareaProps, prevState: {}) {
    if (this.element) {
      this.element.scrollTop = this.element.scrollHeight
    }
  }

  render () {
    return <textarea {...this.props} ref={e => {
      this.element = e
    }} />
  }
}

export default function ProcessingView (
  { chain, codeHash, dispatch } : SourceTabProps
) {
  const [lines, setLines] = useState<string[]>([])
  const [outcome, setOutcome] = useState("error")
  const [socketClosed, setSocketClosed] = useState(false)

  useEffect(() => {
    const socket = api.tailWebsocket({ chain, codeHash })

    // Listen for messages
    socket.addEventListener("message", ({ data }) => {
      const { type, data: msg } = JSON.parse(data) as LogMessage | EndOfLog
      if (type === "LOG") {
        setLines(prevState => (prevState.concat(msg)))
      } else if (type === "EOT" && msg) {
        setOutcome("success")
      } /*
      else handle unknown message type
      */
    })

    function onClose () {
      setSocketClosed(true)
    }

    // Connection closed
    socket.addEventListener("close", onClose)

    return () => {
      socket.removeEventListener("close", onClose)
      socket.close(1000)
    }
  }, [codeHash])

  function dispatchError () {
    dispatch({ type: "verificationError" })
  }

  function dispatchSuccess () {
    dispatch({ type: "verificationSuccess" })
  }

  let status = <span>Verifying...</span>
  let statusIcon = <svg className="inline w-6 h-6 text-gray-400 animate-spin fill-yellow-400" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
  </svg>
  if (socketClosed) {
    if (outcome === "success") {
      statusIcon = <ShieldCheckIcon className="text-green-600 w-5 h-5" />
      status =
        <button
          data-testid="btn-success"
          type="button"
          className="link"
          onClick={dispatchSuccess}
        >
          Browse Verified Files
        </button>
    } else {
      statusIcon = <InformationCircleIcon className="text-red-600 w-5 h-5" />
      status =
        <button
          data-testid="btn-error"
          type="button"
          className="link flex gap-2"
          onClick={dispatchError}
        >
          <ArrowPathIcon className="w-4 h-4 ml-2"/>
          <span>Retry Verification</span>
        </button>
    }
  }

  return (
    <div className="mx-4 mt-4 mb-8 border">
      <div className="flex justify-between items-center bg-neutral-200">
        <div className="flex gap-x-2 p-2 items-center">
          {statusIcon}
          <h3 className="text-sm font-semibold">Process Logs</h3>
        </div>
        <div role="status" className="p-2 m-2 text-xs bg-neutral-300 rounded shadow-inner">
          {status}
        </div>
      </div>
      <AutoScrollingTextarea
        data-testid="ta-logs"
        className="p-4 h-96 border-none focus:ring-0 focus:outline-none bg-neutral-50 text-gray-800 w-full text-sm font-mono"
        value={lines.join("")}
        readOnly={true}
      />
    </div>
  )
}
