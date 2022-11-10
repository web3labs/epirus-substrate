/* eslint-disable no-unused-vars */
import React, { Reducer, useEffect, useReducer } from "react"
import ErrorStatusView from "./ErrorView"
import ProcessingView from "./ProcessingView"
import VerifiedView from "./VerifiedView"
import { SourceTabAction, SourceTabState } from "../../../types/componentStates"
import UnverifiedView from "./UnverifiedView"
import { PageLoading } from "../../loading/Loading"
import api, { InfoResponse } from "../../../apis/verifierApi"
import { useChainProperties } from "../../../contexts/ChainContext"

const reducer: Reducer<SourceTabState, SourceTabAction> = (state, action) => {
  if (action.type === "fetched") {
    return {
      ...state,
      status: action.status
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
  const [state, dispatch] = useReducer(reducer, { action: "init", status: undefined, error: undefined })
  const { action, status, error } = state

  useEffect(() => {
    async function getStatus () {
      try {
        const res = await api.info({ chain: info, codeHash: id })
        if ("status" in res) {
          dispatch({ type: "fetched", status: res.status })
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

  // TODO: Error handling and no data view
  if (error) {
    return <div>ERROR!!!</div>
  }

  if (status === undefined) {
    return <>No data</>
  }

  if (action === "uploading" || status === "staging") {
    return <PageLoading loading={true} />
  }

  let currentView
  switch (status) {
  case "verified":
    currentView = <VerifiedView codeHash={id}/>
    break
  case "processing":
    currentView = <ProcessingView codeHash={id} dispatch={dispatch}/>
    break
  // TODO impl
  // case "metadata":
  //  break
  default:
    currentView = <UnverifiedView codeHash={id} dispatch={dispatch}/>
    break
  }

  return (
    <>
      {
        status === "error" && <ErrorStatusView codeHash={id}/>
      }
      {currentView}
    </>
  )
}
