import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { useClient } from "urql"
import { ChainProperties } from "../types/chain"
import resolveInfoFromName from "./chainNames"

const NULL_CHAIN_PROPERTIES : ChainProperties = {
  name: null,
  version: null,
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
        const { data } = await client
          .query(QUERY, {
            /* vars */
          }).toPromise()
        if (data?.chainProperties?.length > 0) {
          const chainProps = data.chainProperties[0]
          setChainProps({
            ...chainProps,
            info: resolveInfoFromName(chainProps.name)
          })
        }
      } catch (e) {
        // just keep the NULL_CONFIG
        // console.log(e)
      }
    }

    /* istanbul ignore next */
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
