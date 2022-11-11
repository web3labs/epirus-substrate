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
