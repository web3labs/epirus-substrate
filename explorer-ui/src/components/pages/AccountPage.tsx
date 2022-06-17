import React, { useMemo } from "react"

import { useParams } from "react-router-dom"
import { useChainProperties } from "../../contexts/ChainContext"
import useSquid from "../../hooks/useSquid"
import CodeBadge from "../badges/CodeBadge"
import Box from "../Box"
import AccountAddress from "../accounts/AccountAddress"
import ActivityList from "../activities/ActivityList"
import Segment from "../Segment"
import { classNames } from "../../utils/strings"
import Breadcrumbs from "../Breadcrumbs"
import { Account } from "../../types/accounts"
import Tag from "../Tag"
import { formatUnits } from "../../formats/units"
import Tabs, { TabItem } from "../Tabs"

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
  }
}
`

function DefinitionList ({ children } :{ children: JSX.Element | JSX.Element[]}) {
  return (<dl className="flex flex-col w-full gap-y-2">
    {children}
  </dl>)
}

function Definition ({ label, term, className = "" }: {
  label: string, term: JSX.Element | string | undefined | null, className?: string
}) {
  if (term === undefined || term === null) {
    return null
  }

  return (
    <div className={classNames(className, "flex flex-row flex-wrap gap-x-2 items-center")}>
      <dt className="flex text-sm text-gray-500 basis-20">{label}</dt>
      <dd className="text-sm text-gray-900">{term}</dd>
    </div>
  )
}

function ActivityTab ({ id }: {id: string}) {
  return (
    <ActivityList
      currentId={id}
      query={{
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

  const { data, fetching, error } = result

  if (fetching) {
    return null
  }
  if (error) return <p>Oh no... {error.message}</p>

  const { id, contract, balance } = data?.accounts[0] as Account

  return (
    <>
      <Breadcrumbs/>
      <div className="content">

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
          <Box className="col-span-2">
            <div className="flex flex-row flex-wrap items-start justify-between mt-4 gap-x-2">
              <h3 className="mx-5 mb-1 font-medium">
                <AccountAddress address={id}>
                  {contract && <CodeBadge/>}
                </AccountAddress>
              </h3>
              <div className="flex flex-row flex-wrap gap-x-2 ml-5 md:ml-0">
                <Tag label={contract ? "contract" : "EOA"} color="orange"/>
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
