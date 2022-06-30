import React, { useMemo } from "react"

import { useParams } from "react-router-dom"
import { useChainProperties } from "../../contexts/ChainContext"
import useSquid from "../../hooks/useSquid"
import { Contract } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import Box from "../commons/Box"
import AccountAddress from "../accounts/AccountAddress"
import Segment from "../commons/Segment"
import { classNames } from "../../utils/strings"
import AccountLink from "../accounts/AccountLink"
import Breadcrumbs from "../navigation/Breadcrumbs"
import Tag from "../commons/Tag"
import { formatUnits } from "../../formats/units"
import Tabs, { TabItem } from "../navigation/Tabs"
import ActivityTab, { activityByAccount } from "../activities/ActivityTab"
import EventTab from "../events/EventTab"
import CodeLink from "../codes/CodeLink"
import Copy from "../commons/Copy"
import { HexText } from "../commons/Hex"
import ExtrinsicSummary from "../commons/ExtrinsicSummary"

const QUERY = `
query($id: ID!) {
  contracts(where: {id_eq: $id}) {
    createdAt
    id
    salt
    trieId
    storageDeposit
    deployer {
      id
      contract {
        id
      }
    }
    contractCode {
      code
      id
      removedOn
      createdAt
    }
    account {
      balance {
        reserved
        miscFrozen
        free
        feeFrozen
      }
      id
      tags
    }
    createdFrom {
      blockHash
      blockNumber
      id
      hash
      name
      signer
      signature
      tip
      versionInfo
      args {
        type
        name
        value
      }
    }
  }
}
`

function DefinitionList ({ children } :{ children: JSX.Element | JSX.Element[]}) {
  return (<dl className="flex flex-col w-full gap-y-2 overflow-hidden text-ellipsis">
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
      <dt className="flex text-sm text-gray-400 basis-28">{label}</dt>
      <dd className="text-sm text-gray-900">{term}</dd>
    </div>
  )
}

export default function ContractPage () {
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
          label: "Events",
          to: "events",
          element: <EventTab id={params.id} />
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

  const {
    id,
    salt,
    createdAt,
    deployer,
    createdFrom,
    contractCode,
    account,
    storageDeposit
  } = data?.contracts[0] as Contract
  const { balance } = account

  return (
    <>
      <Breadcrumbs/>
      <div className="content">

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
          <Box className="col-span-2 divide-y gap-y-2">
            <div className="flex flex-row flex-wrap w-full items-start justify-between mt-4 gap-x-2">
              <h3 className="mx-5 mb-1 font-medium">
                <Copy text={id}>
                  <AccountAddress address={id}>
                    <CodeBadge/>
                  </AccountAddress>
                </Copy>
              </h3>
              <div className="flex flex-row flex-wrap gap-x-2 px-4">
                <Tag label="wasm" />
              </div>
            </div>
            <Segment>
              <DefinitionList>
                <Definition label="Time" term={
                  <span className="font-mono">{createdAt.toString()}</span>
                }/>
                <Definition label="Code Hash" term={
                  <CodeLink id={contractCode.id} />
                }/>
              </DefinitionList>
            </Segment>

            <ExtrinsicSummary extrinsic={createdFrom} token={token} />

            <Segment title="Creation details" collapsable={true} isOpen={false}>
              <DefinitionList>
                <Definition label="Deployer" term={
                  <AccountLink account={deployer} size={21} />
                } />
                <Definition label="Salt" term={salt &&
                  <HexText>{salt}</HexText>
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
                <Definition
                  className="justify-between"
                  label="Storage Deposit"
                  term={formatUnits(storageDeposit, token)}
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
