export interface TokenProps {
  tokenDecimals: number
  tokenSymbol: string
}

export interface ChainProperties {
  name: string | null
  // info name for endpoint resolution
  info?: string
  version: string | null
  ss58Format?: number
  token: TokenProps
}
