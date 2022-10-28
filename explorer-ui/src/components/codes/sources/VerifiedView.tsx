import React, { useEffect, useState } from "react"
import { useChainProperties } from "../../../contexts/ChainContext"
import api from "../../../apis/verifierApi"

export default function VerifiedView ({ codeHash } : { codeHash: string }) {
  const { info } = useChainProperties()
  const [source, setSource] = useState("")

  useEffect(() => {
    async function loadSource () {
      try {
        const data = await api.resources({ chain: info, codeHash })
        setSource(data)
      } catch (error) {
        // TODO: handle error
        console.log(error)
      }
    }
    if (source === "") {
      loadSource()
    }
  }, [])

  return (
    <div>Verified</div>
  )
}
