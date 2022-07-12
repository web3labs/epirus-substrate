import React from "react"
import { TokenProps } from "../../types/chain"
import { Extrinsic } from "../../types/extrinsic"
import { getArg, getArgValue } from "./Args"
import { DefinitionList, Definition } from "./Definitions"
import { AccountUnit, HexCallData, HexText } from "./Text"
import Segment from "./Segment"

export default function ExtrinsicSummary (
  { extrinsic, token, isOpen = true, title = "Extrinsic" } :
  { extrinsic: Extrinsic, token: TokenProps, isOpen?: boolean, title?: string}
) {
  const { blockNumber, blockHash, id, name, args } = extrinsic
  const data = getArg(args, "data")

  return (
    <Segment title={title} collapsable={true} isOpen={isOpen}>
      <DefinitionList>
        <Definition label="ID" term={
          <span className="font-mono">{id}</span>
        }/>
        <Definition label="Block" term={
          <div>
            <span className="font-mono">#{blockNumber}</span>
            <HexText>{blockHash}</HexText>
          </div>
        }/>
        <Definition label="Name" term={
          <span>{name}</span>
        }/>
        <Definition label="Data" term={
          <HexCallData>
            {typeof data === "string" ? data : undefined}
          </HexCallData>
        }/>
        <Definition label="Gas Limit" term={
          <span className="font-mono">
            {getArg(args, "gasLimit")}
          </span>
        }/>
        <Definition label="Tip" term={
          <AccountUnit amount={getArgValue(args, "tip") || 0} token={token} />
        }/>
        <Definition label="Value" term={
          <AccountUnit amount={getArgValue(args) || 0} token={token} />
        }/>
      </DefinitionList>
    </Segment>
  )
}
