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
import Tabs, { TabItem } from "../navigation/Tabs"
import { Definition, DefinitionList } from "../commons/Definitions"
import ActivityTab, { activityByAccount } from "../activities/ActivityTab"
import ContractTab, { contractByDeployer } from "../contracts/ContractTab"
import CodeTab, { codeByOwner } from "../codes/CodeTab"
import Copy from "../commons/Copy"
import { AccountUnit } from "../commons/Text"
import { longDateTime } from "../../formats/time"
import { PageLoading } from "../loading/Loading"
import SideBar from "../SideBar"

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
    return <PageLoading loading={fetching} />
  }

  if (data?.accounts[0] === undefined) {
    return <span>Account not found</span>
  }

  const { id, contract, createdAt, balance } = data.accounts[0] as Account

  return (
    <>
      <Breadcrumbs/>
      <div className="flex flex-row gap-2 mt-2">
        <SideBar highlight={1} />
        <div className="flex flex-col container">
          <Box>
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
                <Definition label="Created on" term={
                  <span>{longDateTime(createdAt)}</span>
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
                  term={<AccountUnit amount={balance?.free} token={token} />}
                />
                <Definition
                  className="justify-between"
                  label="Reserved"
                  term={<AccountUnit amount={balance?.reserved} token={token} />}
                />
              </DefinitionList>
            </Segment>
            <Segment>
              <DefinitionList>
                <Definition
                  className="justify-between"
                  label="Fee Frozen"
                  term={<AccountUnit amount={balance?.feeFrozen} token={token} />}
                />
                <Definition
                  className="justify-between"
                  label="Misc Frozen"
                  term={<AccountUnit amount={balance?.miscFrozen} token={token} />}
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
