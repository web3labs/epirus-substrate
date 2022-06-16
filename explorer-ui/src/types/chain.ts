export interface ChainProperties {
    name: string | null
    version: string | null
    ss58Format: number | null
    token: {
      tokenDecimals: number
      tokenSymbol: string
    }
}
