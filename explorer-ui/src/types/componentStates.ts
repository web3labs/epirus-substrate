export interface SourceTabState {
  action: string
  status: string | undefined
  error: string | undefined
}

export interface SourceTabAction {
  type: string,
  status?: string,
  error?: string
}
