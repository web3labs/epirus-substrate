import React, { useMemo } from "react"
import Breadcrumbs from "../navigation/Breadcrumbs"
import Box, { BoxHead } from "../commons/Box"
import Segment from "../commons/Segment"
import Tag from "../commons/Tag"
import { DefinitionList, Definition } from "../commons/Definitions"
import { Block } from "../../types/blocks"
import { Edge /* , Page */ } from "../../types/pagination"
import { useParams } from "react-router-dom"
import { longDateTime } from "../../formats/time"
import Tabs, { TabItem } from "../navigation/Tabs"
import EventsTab, { eventsByExtrinsicId } from "./EventsTab"
import LogTab, { logByAccount } from "./LogTab"
import ExtrinsicsTab, {
  extrinsicsByBlockId
} from "../extrinsics/ExtrinsicsTab"
// import BlockList from "./BlockList"
// import Box from "../commons/Box"
// import { NavLink } from "react-router-dom"
export function buildArrayOf (n: number, f: (index: number) => Object) {
  return [...Array(n)].map((_, i) => f(i))
}

export function mockBlock (i: number) {
  return {
    id: i,
    timeStamp: new Date(),
    // this changes as time goes by - e.g., 22 hrs 23 mins ago
    blockTime: new Date(),
    // TODO: abhi - this should be an ... enum type with variants like Finalized, NotFinalized, etc.
    status: "Finalized",
    // TODO: abhi - should be a hash type?
    hash: "0x123",
    // TODO: abhi - should be a hash type?
    parentHash: "0x123",
    // TODO: abhi - should be a hash type?
    stateRoot: "0x123",
    // TODO: abhi - should be a hash type?
    extrinsicsRoot: "0x123",
    // TODO: abhi - should be an account type?
    collator: "n123p3455",
    specVersion: 53
  } as unknown as Block
}

export const mockBlockEdges = buildArrayOf(5, (i) => ({
  node: mockBlock(i)
})) as Edge<Block>[]

export default function BlockPage () {
  const params = useParams()
  const result = mockBlockEdges.find(
    ({ node }: Edge<Block>) => String(node.id) === params.id
  )
  const block =
    result === undefined ? ({ node: mockBlock(1) } as Edge<Block>) : result
  const tabs: TabItem[] = useMemo(() => {
    if (params.id) {
      return [
        {
          label: "Extrinsics",
          to: "",
          element: (
            <ExtrinsicsTab
              currentId={params.id}
              where={extrinsicsByBlockId(params.id)}
            />
          )
        },
        {
          label: "Events",
          to: "contracts",
          element: (
            <EventsTab
              currentId={params.id}
              where={eventsByExtrinsicId(params.id)}
            />
          )
        },
        {
          label: "Log",
          to: "codes",
          element: (
            <LogTab currentId={params.id} where={logByAccount(params.id)} />
          )
        }
      ]
    }
    return []
  }, [params.id])
  return (
    <>
      <Breadcrumbs />
      <div className="content">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
          <Box className="col-span-2 divide-y">
            <BoxHead
              title={
                <>
                  <Tag label={"Block#" + String(block.node.id)} />
                </>
              }
            />
            <Segment>
              <DefinitionList>
                <Definition
                  label="Block Id"
                  term={<span>{block.node.id}</span>}
                />
                <Definition
                  label="Created"
                  term={<span>{longDateTime(block.node.timestamp)}</span>}
                />
                <Definition
                  label="Status"
                  term={<span>{block.node.status}</span>}
                />
                <Definition
                  label="Hash"
                  term={<span>{block.node.hash}</span>}
                />
                <Definition
                  label="Parent Hash"
                  term={<span>{block.node.parentHash}</span>}
                />
                <Definition
                  label="State root"
                  term={<span>{block.node.stateRoot}</span>}
                />
                <Definition
                  label="Extrinsics root"
                  term={<span>{block.node.extrinsicsRoot}</span>}
                />
                <Definition
                  label="Collator"
                  term={<span>{block.node.collator}</span>}
                />
                <Definition
                  label="specVersion"
                  term={<span>{block.node.specVersion}</span>}
                />
              </DefinitionList>
            </Segment>
          </Box>
        </div>
        <Box className="mt-2">
          <Tabs items={tabs} />
        </Box>
      </div>
    </>
  )
}
