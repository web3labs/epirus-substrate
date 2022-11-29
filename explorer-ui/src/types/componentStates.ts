/* eslint-disable no-unused-vars */
import { InfoResponse } from "../apis/verifierApi"

export interface SourceTabState {
  action: string
  status: string | undefined
  timestamp: string | undefined
  error: string | undefined
}

export interface SourceTabAction {
  type: string,
  info?: InfoResponse,
  error?: string
}

export const enum ReducerActionType {
  FETCHED = "fetched",
  UPLOADING = "uploading",
  UPLOADED = "uploaded",
  ERROR = "error",
  RE_UPLOAD = "reUpload",
  VERIFICATION_ERROR = "verificationError",
  VERIFICATION_SUCCESS = "verificationSuccess"
}
