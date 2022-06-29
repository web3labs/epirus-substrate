import React from "react"
import useSquid from "../../hooks/useSquid"
import { ContractCode } from "../../types/codes"
import { hexToBytes } from "../../utils/hex"
import Loading from "../loading/Loading"
import { HexView } from "./HexView"

const QUERY = `
query($id: ID!) {
  contractCodes(where: {id_eq: $id}) {
    code
  }
}
`

export default function BinaryTab ({ id }:{id: string}) {
  const [result] = useSquid({
    query: QUERY,
    variables: { id },
    refresh: {
      disabled: true,
      millis: 0
    }
  })

  const { data, fetching } = result

  if (fetching) return <Loading />

  const codeHash = data?.contractCodes[0] as ContractCode

  return (
    <div className="mx-4 my-2">
      <HexView bytes={hexToBytes(codeHash.code.slice(2))}/>
    </div>
  )
}
