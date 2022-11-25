import React from "react"
import { TokenProps } from "../../types/chain"
import { Extrinsic } from "../../types/extrinsic"
import { getArg, getArgValue } from "../../utils/args"
import { DefinitionList, Definition } from "./Definitions"
import { AccountUnit, HexCallData, HexText } from "./Text"
import Segment from "./Segment"
import { longDateTime } from "../../formats/time"

export default function ExtrinsicSummary (
  { extrinsic, token, isOpen = true, title = "Extrinsic" } :
  { extrinsic: Extrinsic, token: TokenProps, isOpen?: boolean, title?: string}
) {
  const { blockNumber, blockHash, indexInBlock, name, args, createdAt } = extrinsic
  const data = getArg(args, "data")
  // TODO: gasLimit arg could be a Weight struct
  const gasLimit = getArg(args, "gasLimit")

  return (
    <Segment title={title} collapsable={true} isOpen={isOpen}>
      <DefinitionList>
        <Definition label="Block" term={
          <div>
            <span className="font-mono">#{blockNumber}</span>
            <HexText>{blockHash}</HexText>
          </div>
        }/>
        <Definition label="Extrinsic" term={
          <span className="font-mono">{blockNumber}-{indexInBlock}</span>
        }/>
        <Definition label="Time" term={
          <span>{longDateTime(createdAt)}</span>
        }/>
        <Definition label="Name" term={
          <span>{name}</span>
        }/>
        <>
          { data && typeof data === "string" &&
            <Definition label="Data" term={
              <HexCallData>
                {data}
              </HexCallData>
            }/>
          }
        </>
        <>
          { gasLimit &&
          <Definition label="Gas Limit" term={
            typeof gasLimit === "object"
              ? <span className="font-mono">
                {(gasLimit as unknown as any).refTime}
              </span>
              : <span className="font-mono">
                {gasLimit}
              </span>
          }/>
          }
        </>
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
