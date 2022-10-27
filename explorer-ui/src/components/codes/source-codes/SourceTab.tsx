/* eslint-disable no-unused-vars */
import React, { Reducer, useEffect, useReducer } from "react"
import ErrorStatusView from "./ErrorView"
import ProcessingView from "./ProcessingView"
import VerifiedView from "./VerifiedView"
import { SourceTabAction, SourceTabState } from "../../../types/componentStates"
import UnverifiedView from "./UnverifiedView"
import { PageLoading } from "../../loading/Loading"

const BASE_URL = "https://bc8a6852-7bb3-42b6-acde-63f49014975f.mock.pstmn.io"
// const BASE_URL = "http://127.0.0.1:3000"

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

export default function SourceTab ({ id }:{id: string}) {
  const [state, dispatch] = useReducer(reducer, { action: "init", status: undefined, error: undefined })
  const { action, status, error } = state

  useEffect(() => {
    // TODO: Extract endpoint to env var
    fetch(`${BASE_URL}/info/rococoContracts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        dispatch({ type: "fetched", status: data.status, error: data.error })
      })
      .catch(error => {
        dispatch({ type: "networkError", error })
      })
  }, [action])

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
        status === "error" && <ErrorStatusView id={id}/>
      }
      {
        (status === "unknown" || status === "error") &&
        <UnverifiedView id={id} dispatch={dispatch}/>
      }
      {
        status === "processing" && <ProcessingView id={id} dispatch={dispatch}/>
      }
      {
        status === "verified" && <VerifiedView/>
      }
    </>
  )
}
