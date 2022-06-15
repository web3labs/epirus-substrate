import React, { createContext, useContext } from "react"

export interface ChainProperties {
    systemName: string | null
    systemVersion: string | null
    tokenDecimals: number
    tokenSymbol: string
}

const NULL_CHAIN_PROPERTIES : ChainProperties = {
  systemName: null,
  systemVersion: null,
  tokenDecimals: 12,
  tokenSymbol: "Unit"
}

export const ChainContext = createContext(NULL_CHAIN_PROPERTIES)

export default function ChainContextProvider ({ children }: React.PropsWithChildren<Partial<ChainProperties>>) {
  // TODO resolve chain properties from Squid
  return (
    <ChainContext.Provider value={NULL_CHAIN_PROPERTIES}>
      {children}
    </ChainContext.Provider>
  )
}

export const useChainProperties = () => useContext(ChainContext)
