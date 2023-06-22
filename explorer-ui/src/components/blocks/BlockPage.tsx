import React, { useMemo } from "react"
import useSquid from "../../hooks/useSquid"
import { PageLoading } from "../loading/Loading"
import Breadcrumbs from "../navigation/Breadcrumbs"
import Box, { BoxHead } from "../commons/Box"
import Segment from "../commons/Segment"
import Tag from "../commons/Tag"
import { DefinitionList, Definition } from "../commons/Definitions"
import { Block } from "../../types/blocks"
import { NavLink, useParams } from "react-router-dom"
import { longDateTime } from "../../formats/time"
import Tabs, { TabItem } from "../navigation/Tabs"
import EventsTab, { eventsByHash } from "./events/EventsTab"
import ExtrinsicsTab, { extrinsicsByBlockHash } from "../extrinsics/ExtrinsicsTab"
import SideBar from "../navigation/SideBar"

const QUERY = `
query($hash: String!) {
  blocks(where: {hash_eq: $hash}) {
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

  const tabs: TabItem[] = useMemo(() => {
    if (params.hash) {
      return [
        {
          label: "Extrinsics",
          to: "",
          element: (
            <ExtrinsicsTab
              currentId={params.hash}
              where={extrinsicsByBlockHash(params.hash)}
            />
          )
        },
        {
          label: "Events",
          to: "events",
          element: (
            <EventsTab
              currentId={params.id}
              where={eventsByHash(params.hash)}
            />
          )
        }
      ]
    }
    return []
  }, [params.hash])

  const [result] = useSquid({
    query: QUERY,
    variables: { hash: params.hash }
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
      <div className="flex flex-row gap-2 mt-2">
        <SideBar highlight={3} />
        <div className="flex flex-col container">
          <Box>
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
                  term={<span> {height === 0 ? parentHash : <NavLink to={`/blocks/${parentHash}`} className="link">{parentHash}</NavLink> } </span>}
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
          <Box className="mt-2">
            <Tabs items={tabs} />
          </Box>
        </div>
      </div>
    </>
  )
}
