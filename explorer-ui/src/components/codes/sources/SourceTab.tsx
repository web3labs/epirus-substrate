/* eslint-disable no-unused-vars */
import React, { Reducer, useEffect, useReducer } from "react"
import ErrorStatusView from "./ErrorView"
import ProcessingView from "./ProcessingView"
import VerifiedView from "./VerifiedView"
import { SourceTabAction, SourceTabState } from "../../../types/componentStates"
import UnverifiedView from "./UnverifiedView"
import { PageLoading } from "../../loading/Loading"
import api from "../../../apis/verifierApi"
import { useChainProperties } from "../../../contexts/ChainContext"
import { Warning } from "../../commons/Alert"

const reducer: Reducer<SourceTabState, SourceTabAction> = (state, action) => {
  if (action.type === "fetched") {
    return {
      ...state,
      status: action.info?.status,
      timestamp: action.info?.timestamp
    }
  } else if (action.type === "error") {
    return {
      ...state,
      error: action.error
    }
  } else {
    return {
      ...state,
      action: action.type
    }
  }
}

export default function SourceTab (
  { id } :
  { id: string }
) {
  const { info } = useChainProperties()
  const [state, dispatch] = useReducer(
    reducer,
    {
      action: "init",
      status: undefined,
      timestamp: undefined,
      error: undefined
    }
  )
  const { action, status, timestamp, error } = state

  useEffect(() => {
    async function getStatus () {
      try {
        const res = await api.info({ chain: info, codeHash: id })
        if ("status" in res) {
          dispatch({ type: "fetched", info: res })
        } else {
          dispatch({ type: "error", error: res.message })
        }
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : error as string
        dispatch({ type: "error", error: errMsg })
      }
    }

    getStatus()
  }, [action])

  if (error) {
    return <Warning
      title="Error"
      message={error || "Unknown error."}
    />
  }

  if (
    status === undefined ||
    action === "uploading" ||
    status === "staging"
  ) {
    return <PageLoading loading={true} />
  }

  switch (status) {
  case "verified":
    return <VerifiedView codeHash={id}/>
  case "processing":
    return <ProcessingView codeHash={id} dispatch={dispatch}/>
  // TODO impl
  // case "metadata":
  //  break
  default:
    return (
      <>
        {
          status === "error" && <ErrorStatusView codeHash={id} timestamp={timestamp}/>
        }
        <UnverifiedView codeHash={id} dispatch={dispatch}/>
      </>
    )
  }
}
