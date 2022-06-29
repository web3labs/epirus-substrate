import React, { useMemo } from "react"

import { useParams } from "react-router-dom"
import { useChainProperties } from "../../contexts/ChainContext"
import useSquid from "../../hooks/useSquid"
import CodeBadge from "../badges/CodeBadge"
import Box from "../commons/Box"
import AccountAddress from "../accounts/AccountAddress"
import ActivityList from "../activities/ActivityList"
import Segment from "../commons/Segment"
import Breadcrumbs from "../navigation/Breadcrumbs"
import { Account } from "../../types/accounts"
import Tag from "../Tag"
import { formatUnits } from "../../formats/units"
import Tabs, { TabItem } from "../navigation/Tabs"
import { Definition, DefinitionList } from "../commons/Definitions"

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

function ActivityTab ({ id }: {id: string}) {
  return (
    <ActivityList
      currentId={id}
      pageQuery={{
        first: 10,
        where: {
          from: {
            id_eq: id
          },
          OR: {
            to: {
              id_eq: id
            }
          }
        }
      }}
    />
  )
}

export default function AccountPage () {
  const { token } = useChainProperties()

  const params = useParams()

  const tabs : TabItem[] = useMemo(() => {
    if (params.id) {
      return [
        {
          label: "Activities",
          to: "",
          element: <ActivityTab id={params.id} />
        },
        {
          label: "Contracts",
          to: "contracts",
          element: <div>TBD</div>
        },
        {
          label: "Sources",
          to: "sources",
          element: <div>TBD</div>
        }
      ]
    }
    return []
  }, [params.id])

  const [result] = useSquid({
    query: QUERY,
    variables: { id: params.id },
    refresh: {
      disabled: true,
      millis: 0
    }
  })

  const { data, fetching } = result

  if (fetching) {
    return null
  }

  const { id, contract, balance } = data?.accounts[0] as Account

  return (
    <>
      <Breadcrumbs/>
      <div className="content">

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
          <Box className="col-span-2">
            <div className="flex flex-row flex-wrap w-full items-start justify-between mt-4 gap-x-2">
              <h3 className="mx-5 mb-1 font-medium">
                <AccountAddress address={id}>
                  {contract && <CodeBadge/>}
                </AccountAddress>
              </h3>
              <div className="flex flex-row flex-wrap gap-x-2 px-4">
                <Tag label={contract ? "contract" : "EOA"} />
              </div>
            </div>
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
          </Box>
        </div>

        <Box className="mt-2">
          <Tabs items={tabs} />
        </Box>
      </div>
    </>
  )
}
