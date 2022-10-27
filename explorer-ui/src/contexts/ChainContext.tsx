import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { useClient } from "urql"
import { ChainProperties } from "../types/chain"
import resolveInfoFromName from "./chainNames"

const NULL_CHAIN_PROPERTIES : ChainProperties = {
  name: null,
  version: null,
  ss58Format: null,
  token: {
    tokenDecimals: 12,
    tokenSymbol: "UNK"
  }
}

const QUERY = `
query{
  chainProperties {
    id
    name
    ss58Format
    token {
      tokenDecimals
      tokenSymbol
    }
  }
}
`

export const ChainContext = createContext(NULL_CHAIN_PROPERTIES)

export default function ChainContextProvider ({ children }: React.PropsWithChildren<Partial<ChainProperties>>) {
  const init = useRef(true)
  const [chainProps, setChainProps] = useState(NULL_CHAIN_PROPERTIES)
  const client = useClient()

  // Execute just once on initialization
  useEffect(() => {
    async function loadChainProperties () {
      try {
        const { data, error } = await client
          .query(QUERY, {
            /* vars */
          }).toPromise()

        if (error) {
          console.log(error)
        }

        if (data?.chainProperties?.length > 0) {
          const chainProps = data.chainProperties[0]
          setChainProps({
            ...chainProps,
            info: resolveInfoFromName(chainProps.name)
          })
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (init.current) {
      init.current = false
      loadChainProperties()
    }
  }, [])

  return (
    <ChainContext.Provider value={chainProps}>
      {children}
    </ChainContext.Provider>
  )
}

export const useChainProperties = () => useContext(ChainContext)
