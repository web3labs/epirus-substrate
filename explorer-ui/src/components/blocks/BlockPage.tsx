import React, { useMemo } from "react"
import useSquid from "../../hooks/useSquid"
import { PageLoading } from "../loading/Loading"
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
import EventsTab, { eventsByBlockId } from "./events/EventsTab"
// import LogTab, { logByAccount } from "./LogTab"
import ExtrinsicsTab, {
  extrinsicsByBlockId
} from "../extrinsics/ExtrinsicsTab"
import SideBar from "../SideBar"
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

const QUERY = `
query($id: String!) {
  blocks(where: {id_eq: $id}) {
    id
    height
    hash
    extrinsicsRoot
    parentHash
    stateRoot
    timestamp
    spec {
      specVersion
    }
    extrinsics {
      id
      success
      hash
    }
  }
}
`

export default function BlockPage () {
  const params = useParams()
  /*
  const result = mockBlockEdges.find(
    ({ node }: Edge<Block>) => String(node.id) === params.id
  )
  const block =
    result === undefined ? ({ node: mockBlock(1) } as Edge<Block>) : result
  */
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
          to: "events",
          element: (
            <EventsTab
              currentId={params.id}
              where={eventsByBlockId(params.id)}
            />
          )
        }
      ]
    }
    return []
  }, [params.id])

  const [result] = useSquid({
    query: QUERY,
    variables: { id: params.id }
  })

  const { data, fetching } = result

  if (fetching) {
    return <PageLoading loading={fetching} />
  }

  if (data?.blocks[0] === undefined) {
    return <div className="m-3">Block not found.</div>
  }

  const {
    id,
    height,
    timestamp,
    hash,
    parentHash,
    stateRoot,
    extrinsicsRoot,
    spec
  } = data?.blocks[0] as Block

  return (
    <>
      <Breadcrumbs />
      <div className="flex flex-row gap-2">
        <SideBar highlight={4} />
        <div className="content w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
            <Box className="col-span-2 divide-y">
              <BoxHead
                title={
                  <>
                    <Tag label={"Block#" + String(height)} />
                  </>
                }
              />
              <Segment>
                <DefinitionList>
                  <Definition
                    label="Block Id"
                    term={<span>{id}</span>}
                  />
                  <Definition
                    label="Created"
                    term={<span>{longDateTime(timestamp)}</span>}
                  />
                  <Definition
                    label="Hash"
                    term={<span>{hash}</span>}
                  />
                  <Definition
                    label="Parent Hash"
                    term={<span>{parentHash}</span>}
                  />
                  <Definition
                    label="State root"
                    term={<span>{stateRoot}</span>}
                  />
                  <Definition
                    label="Extrinsics root"
                    term={<span>{extrinsicsRoot}</span>}
                  />
                  <Definition
                    label="specVersion"
                    term={<span>{spec.specVersion}</span>}
                  />
                </DefinitionList>
              </Segment>
            </Box>
          </div>
          <Box className="mt-2">
            <Tabs items={tabs} />
          </Box>
        </div>
      </div>
    </>
  )
}
