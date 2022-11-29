/* eslint-disable no-unused-vars */
import React, { Dispatch, Reducer, useEffect, useReducer } from "react"
import ErrorStatusView from "./ErrorView"
import ProcessingView from "./ProcessingView"
import VerifiedView from "./VerifiedView"
import { ReducerActionType, SourceTabAction, SourceTabState } from "../../../types/componentStates"
import UnverifiedView from "./UnverifiedView"
import { PageLoading } from "../../loading/Loading"
import api from "../../../apis/verifierApi"
import { useChainProperties } from "../../../contexts/ChainContext"
import { Warning } from "../../commons/Alert"
import { errMsg } from "../../../utils/errors"
import MetadataView from "./MetadataView"

/**
 * Reducer to keep track of complex state logic
 * within the source code verification component
 * @param state Current state of the component
 * @param action dispatched action
 * @returns New state
 */
const reducer: Reducer<SourceTabState, SourceTabAction> = (state, action) => {
  switch (action.type) {
  case ReducerActionType.FETCHED:
    return {
      ...state,
      status: action.info?.status,
      timestamp: action.info?.timestamp
    }
  case ReducerActionType.ERROR:
    return {
      ...state,
      error: action.error
    }
  case ReducerActionType.UPLOADING:
  case ReducerActionType.UPLOADED:
  case ReducerActionType.RE_UPLOAD:
  case ReducerActionType.VERIFICATION_ERROR:
  case ReducerActionType.VERIFICATION_SUCCESS:
    return {
      ...state,
      action: action.type
    }
  default:
    return {
      ...state,
      error: "Unknown action type on source code verification component state"
    }
  }
}

export interface SourceTabProps {
  codeHash: string,
  chain: string,
  dispatch: Dispatch<SourceTabAction>
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
  const chain = info || "local"

  useEffect(() => {
    async function getStatus () {
      try {
        const res = await api.info({ chain: info, codeHash: id })
        if ("status" in res) {
          dispatch({ type: ReducerActionType.FETCHED, info: res })
        } else {
          dispatch({ type: ReducerActionType.ERROR, error: res.message })
        }
      } catch (error: unknown) {
        dispatch({ type: ReducerActionType.ERROR, error: errMsg(error) })
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
    action === ReducerActionType.UPLOADING ||
    status === "staging"
  ) {
    return <PageLoading loading={true} />
  }

  if (action === ReducerActionType.RE_UPLOAD) {
    return <UnverifiedView chain={chain} codeHash={id} dispatch={dispatch}/>
  }

  switch (status) {
  case "verified":
    return <VerifiedView codeHash={id} dispatch={dispatch}/>
  case "processing":
    return <ProcessingView chain={chain} codeHash={id} dispatch={dispatch}/>
  case "metadata":
    return <MetadataView codeHash={id} sourceType="signed-metadata" dispatch={dispatch}/>
  default:
    return (
      <>
        {
          status === "error" && <ErrorStatusView codeHash={id} timestamp={timestamp}/>
        }
        <UnverifiedView chain={chain} codeHash={id} dispatch={dispatch}/>
      </>
    )
  }
}
