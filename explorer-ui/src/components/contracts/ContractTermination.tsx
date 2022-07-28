import React from "react"
import Segment from "../commons/Segment"
import AccountLink from "../accounts/AccountLink"
import { longDateTime } from "../../formats/time"
import { Account } from "../../types/accounts"
import { Extrinsic } from "../../types/extrinsic"
import { DefinitionList, Definition } from "../commons/Definitions"

export function ContractTermination (
  { extrinsic, beneficiary, isOpen = true, title = "Termination Details" } :
  { extrinsic: Extrinsic; beneficiary: Account; isOpen?: boolean; title?: string; }
) {
  const { createdAt, blockNumber, indexInBlock } = extrinsic
  return (
    <Segment title={title} collapsable={true} isOpen={isOpen}>
      <DefinitionList>
        <Definition label="Block" term={<span className="font-mono">#{blockNumber}</span>} />
        <Definition label="Extrinsic" term={<span className="font-mono">{blockNumber}-{indexInBlock}</span>} />
        <Definition label="Time" term={<span>{longDateTime(createdAt)}</span>} />
        <Definition label="Beneficiary" term={<AccountLink account={beneficiary} />} />
      </DefinitionList>
    </Segment>
  )
}
