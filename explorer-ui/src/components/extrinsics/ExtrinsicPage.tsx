import React /*, { useMemo } */ from "react"
import { useParams } from "react-router-dom"
// import { useChainProperties } from "../../contexts/ChainContext
import useSquid from "../../hooks/useSquid"
import CodeBadge from "../badges/CodeBadge"
import Box, { BoxHead } from "../commons/Box"
import Segment from "../commons/Segment"
import Breadcrumbs from "../navigation/Breadcrumbs"
// import { Account } from "../../types/accounts
import AccountAddress from "../accounts/AccountAddress"
import Tag from "../commons/Tag"
// import Tabs, { TabItem } from "../navigation/Tabs"
import { Definition, DefinitionList } from "../commons/Definitions"
// import EventsTab, { eventsByExtrinsicId } from "./EventsTab"
// import { Extrinsic } from "../../types/extrinsic
import Copy from "../commons/Copy"
// import { AccountUnit } from "../commons/Text
import { longDateTime } from "../../formats/time"
import { PageLoading } from "../loading/Loading"
import { ExtrinsicPageType } from "../../types/extrinsic"
import CheckBadge from "../badges/CheckBadge"
import CrossBadge from "../badges/CrossBadge"

const QUERY = `
query($id: String!) {
  extrinsics(where: {id_eq: $id}) {
    id
    tip
    success
    hash
    fee
    block {
      id
      timestamp
    }
    call {
      name
      args
    }
  }
}
`
export default function ExtrinsicPage () {
  const params = useParams()

  /*
  const tabs: TabItem[] = useMemo(() => {
    if (params.id) {
      return [
        {
          label: "Events",
          to: "",
          element: (
            <EventsTab
              currentId={params.id}
              where={eventsByExtrinsicId(params.id)}
            />
          )
        }
      ]
    }
    return []
  }, [params.id])

  const result = {
    id: "1",
    createdAt: new Date(),
    blockNumber: "1234",
    indexInBlock: "1",
    success: true
  }

  const createdAt = new Date()
  */

  const [result] = useSquid({
    query: QUERY,
    variables: { id: params.id }
  })

  const { data, fetching } = result

  if (fetching) {
    return <PageLoading loading={fetching} />
  }

  if (data?.extrinsics[0] === undefined) {
    return <div className="m-3">Block not found.</div>
  }

  const {
    id,
    tip,
    success,
    fee,
    block,
    call,
    hash
  } = data?.extrinsics[0] as ExtrinsicPageType

  return (
    <>
      <Breadcrumbs />
      <div className="content">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
          <Box className="col-span-2 divide-y">
            <BoxHead
              title={
                <Copy text={id}>
                  <AccountAddress address={id}>
                    {<CodeBadge />}
                  </AccountAddress>
                </Copy>
              }
              tag={<Tag label="success" />}
            />

            <Segment>
              <DefinitionList>
                <Definition
                  label="Timestamp"
                  term={<span>{longDateTime(block.timestamp)}</span>}
                />
                <Definition
                  label="Block"
                  term={<span>{block.id}</span>}
                />
                <Definition
                  label="Status"
                  term={<span>{success ? <CheckBadge/> : <CrossBadge/>}</span>}
                />
                <Definition label="Hash" term={<span>{hash}</span>} />
                <Definition label="Fee" term={<span>{fee ? fee.toString() : "-"}</span>} />
                <Definition label="Tip" term={<span>{tip ? tip.toString() : "-"}</span>} />
                <Definition label="Action" term={<span>{call.name}</span>} />
              </DefinitionList>
            </Segment>
          </Box>
        </div>

        {/*
        <Box className="mt-2">
          <Tabs items={tabs} />
        </Box>
        */}
      </div>
    </>
  )
}
