import React from "react"
import { TokenProps } from "../../types/chain"
import { Extrinsic } from "../../types/extrinsic"
import { argValue } from "../../utils/types"
import { formatValue } from "./Args"
import { DefinitionList, Definition } from "./Definitions"
import { HexCallData, HexText } from "./Hex"
import Segment from "./Segment"

export default function ExtrinsicSummary (
  { extrinsic, token, isOpen = true } :
  { extrinsic: Extrinsic, token: TokenProps, isOpen?: boolean}
) {
  const { blockNumber, blockHash, id, name, args } = extrinsic

  return (
    <Segment title="Extrinsic" collapsable={true} isOpen={isOpen}>
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
            {argValue(args, "data")}
          </HexCallData>
        }/>
        <Definition label="Gas Limit" term={
          <span className="font-mono">
            {argValue(args, "gasLimit")}
          </span>
        }/>
        <Definition label="Value" term={
          <span className="font-mono">
            {formatValue(args, token) || 0}
          </span>
        }/>
      </DefinitionList>
    </Segment>
  )
}
