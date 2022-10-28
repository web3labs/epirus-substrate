import React, { useEffect, useState } from "react"
import { useChainProperties } from "../../../contexts/ChainContext"
import api from "../../../apis/verifierApi"

export default function VerifiedView ({
  id
} : {
  id: string
}) {
  const { info } = useChainProperties()
  const [source, setSource] = useState("")

  useEffect(() => {
    async function loadSource () {
      try {
        const data = await api.resources({ chain: info, codeHash: id })

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
