import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
// import { useChainProperties } from "../../contexts/ChainContext
// import useSquid from "../../hooks/useSquid
import CodeBadge from "../badges/CodeBadge"
import Box, { BoxHead } from "../commons/Box"
import Segment from "../commons/Segment"
import Breadcrumbs from "../navigation/Breadcrumbs"
// import { Account } from "../../types/accounts
import AccountAddress from "../accounts/AccountAddress"
import Tag from "../commons/Tag"
import Tabs, { TabItem } from "../navigation/Tabs"
import { Definition, DefinitionList } from "../commons/Definitions"
import EventsTab, { eventsByExtrinsicId } from "./EventsTab"
// import { Extrinsic } from "../../types/extrinsic
import Copy from "../commons/Copy"
// import { AccountUnit } from "../commons/Text
import { longDateTime } from "../../formats/time"
// import { PageLoading } from "../loading/Loading"

/*
const QUERY = `
query($id: String!) {
  accounts(where: {id_eq: $id}) {
    id
    tags
    codesOwned {
      id
    }
    contractsDeployed {
      id
    }
    balance {
      free
      reserved
      feeFrozen
    }
    contract {
      id
    }
    createdAt
  }
}
`
*/
export default function ExtrinsicPage () {
  const params = useParams()

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

  return (
    <>
      <Breadcrumbs />
      <div className="content">
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
          <Box className="col-span-2 divide-y">
            <BoxHead
              title={
                <Copy text={result.id}>
                  <AccountAddress address={result.id}>
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
                  term={<span>{longDateTime(createdAt)}</span>}
                />
                <Definition
                  label="Block"
                  term={<span>{result.blockNumber}</span>}
                />
                <Definition
                  label="LifeTime"
                  term={<span>some lifetime</span>}
                />
                <Definition label="Hash" term={<span>some hash</span>} />
                <Definition label="From" term={<span>some from</span>} />
                <Definition label="Fee" term={<span>some fee</span>} />
                <Definition label="Tip" term={<span>some tip</span>} />
                <Definition label="Nonce" term={<span>some nonce</span>} />
                <Definition label="Action" term={<span>some action</span>} />
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
