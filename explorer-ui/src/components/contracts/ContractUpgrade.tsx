import React from "react"
import { ArrowRightIcon, ArrowDownIcon } from "@heroicons/react/solid"
import { DefinitionList, Definition } from "../commons/Definitions"
import Segment from "../commons/Segment"
import { CodeHashChange } from "../../types/contracts"
import { longDateTime } from "../../formats/time"
import CodeLink from "../codes/CodeLink"
import { Default, Mobile } from "../responsive/Media"

export default function ContractUpgrades (
  { codeHashChanges, isOpen = false, title = "Contract Upgrades" } :
  { codeHashChanges: CodeHashChange[], isOpen?: boolean, title?: string}
) {
  const changeDetails : JSX.Element[] = []
  for (const change of codeHashChanges) {
    changeDetails.push(<ChangeDetails key={change.id} codeHashChange={change}/>)
  }
  return (
    <Segment title={title} collapsable={true} isOpen={isOpen}>
      <div className="divide-y">
        {changeDetails}
      </div>
    </Segment>
  )
}

function ChangeDetails (
  { codeHashChange } :
  { codeHashChange: CodeHashChange }
) {
  const { newCodeHash, oldCodeHash, changedAt, extrinsic } = codeHashChange

  return (
    <Segment className="divide-y" collapsable={false}>
      <DefinitionList>
        <Definition label="Time" term={
          <>
            <span>{longDateTime(changedAt)}</span>
          </>
        }/>
        <Definition label="Extrinsic" term={
          <span className="font-mono">{extrinsic.id}</span>
        }/>
        <Definition className="md:items-center" label="Upgraded from" term={
          <div className="flex flex-col flex-wrap items-center gap-y-2 md:flex-row md:gap-x-2">
            <CodeLink id={oldCodeHash}/>
            <Default>
              <ArrowRightIcon width={16} height={16}/>
            </Default>
            <Mobile>
              <ArrowDownIcon width={16} height={16}/>
            </Mobile>
            <CodeLink id={newCodeHash}/>
          </div>
        }/>
      </DefinitionList>
    </Segment>
  )
}
