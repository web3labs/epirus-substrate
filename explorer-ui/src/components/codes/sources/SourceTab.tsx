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

const reducer: Reducer<SourceTabState, SourceTabAction> = (state, action) => {
  if (action.type === "fetched") {
    return {
      ...state,
      status: action.status,
      error: action.error
    }
  } else if (action.type === "networkError") {
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
        const data = await api.info({ chain: info, codeHash: id })
        dispatch({ type: "fetched", status: data.status, error: data.error })
      } catch (error) {
        if (error instanceof Error) {
          dispatch({ type: "networkError", error: error.message })
        }
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

  return (
    <>
      {
        status === "error" && <ErrorStatusView codeHash={id}/>
      }
      {
        (status === "unknown" || status === "error") &&
        <UnverifiedView codeHash={id} dispatch={dispatch}/>
      }
      {
        status === "processing" && <ProcessingView codeHash={id} dispatch={dispatch}/>
      }
      {
        status === "verified" && <VerifiedView codeHash={id}/>
      }
    </>
  )
}
