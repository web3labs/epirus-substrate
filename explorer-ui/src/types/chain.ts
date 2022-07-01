export interface TokenProps {
  tokenDecimals: number
  tokenSymbol: string
}

export interface ChainProperties {
  name: string | null
  version: string | null
  ss58Format: number | null
  token: TokenProps
}
