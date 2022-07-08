import React, { useMemo } from "react"

import { useParams } from "react-router-dom"
import { useChainProperties } from "../../contexts/ChainContext"
import useSquid from "../../hooks/useSquid"
import CodeBadge from "../badges/CodeBadge"
import Box, { BoxHead } from "../commons/Box"
import AccountAddress from "./AccountAddress"
import Segment from "../commons/Segment"
import Breadcrumbs from "../navigation/Breadcrumbs"
import { Account } from "../../types/accounts"
import Tag from "../commons/Tag"
import { formatUnits } from "../../formats/units"
import Tabs, { TabItem } from "../navigation/Tabs"
import { Definition, DefinitionList } from "../commons/Definitions"
import ActivityTab, { activityByAccount } from "../activities/ActivityTab"
import ContractTab, { contractByDeployer } from "../contracts/ContractTab"
import CodeTab, { codeByOwner } from "../codes/CodeTab"
import Copy from "../commons/Copy"

const QUERY = `
query($id: ID!) {
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

export default function AccountPage () {
  const { token } = useChainProperties()

  const params = useParams()

  const tabs : TabItem[] = useMemo(() => {
    if (params.id) {
      return [
        {
          label: "Activities",
          to: "",
          element: <ActivityTab
            currentId={params.id}
            where={activityByAccount(params.id)}
          />
        },
        {
          label: "Contracts",
          to: "contracts",
          element: <ContractTab
            currentId={params.id}
            where={contractByDeployer(params.id)}
          />
        },
        {
          label: "Codes",
          to: "codes",
          element: <CodeTab
            currentId={params.id}
            where={codeByOwner(params.id)}
          />
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
    return null
  }

  const { id, contract, createdAt, balance } = data?.accounts[0] as Account

  return (
    <>
      <Breadcrumbs/>
      <div className="content">

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
          <Box className="col-span-2 divide-y">
            <BoxHead
              title={
                <Copy text={id}>
                  <AccountAddress address={id}>
                    {contract && <CodeBadge/>}
                  </AccountAddress>
                </Copy>
              }
              tag={
                <Tag label={contract ? "contract" : "EOA"} />
              }
            />

            <Segment>
              <DefinitionList>
                <Definition label="Time" term={
                  <span className="font-mono">{createdAt.toString()}</span>
                }/>
              </DefinitionList>
            </Segment>
          </Box>
          <Box>
            <Segment title="Balance">
              <DefinitionList>
                <Definition
                  className="justify-between"
                  label="Free"
                  term={formatUnits(balance.free, token)}
                />
                <Definition
                  className="justify-between"
                  label="Reserved"
                  term={formatUnits(balance.reserved, token)}
                />
              </DefinitionList>
            </Segment>
            <Segment>
              <DefinitionList>
                <Definition
                  className="justify-between"
                  label="Fee Frozen"
                  term={formatUnits(balance.feeFrozen, token)}
                />
                <Definition
                  className="justify-between"
                  label="Misc Frozen"
                  term={formatUnits(balance.miscFrozen, token)}
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
