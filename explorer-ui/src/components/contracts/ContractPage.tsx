import React, { useMemo } from "react"

import { useParams } from "react-router-dom"
import { useChainProperties } from "../../contexts/ChainContext"
import useSquid from "../../hooks/useSquid"
import { Contract } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import Box, { BoxHead } from "../commons/Box"
import AccountAddress from "../accounts/AccountAddress"
import Segment from "../commons/Segment"
import AccountLink from "../accounts/AccountLink"
import Breadcrumbs from "../navigation/Breadcrumbs"
import Tag from "../commons/Tag"
import Tabs, { TabItem } from "../navigation/Tabs"
import ActivityTab, { activityByAccount } from "../activities/ActivityTab"
import EventTab from "../events/EventTab"
import CodeLink from "../codes/CodeLink"
import Copy from "../commons/Copy"
import { AccountUnit, HexText } from "../commons/Text"
import ExtrinsicSummary from "../commons/ExtrinsicSummary"
import { longDateTime } from "../../formats/time"
import { PageLoading } from "../loading/Loading"
import ContractUpgrades from "./ContractUpgrade"
import { ContractTermination } from "./ContractTermination"
import { DefinitionList, Definition } from "../commons/Definitions"
import { getArg } from "../../utils/args"

const QUERY = `
query($id: String!, $codeHashChangeOrderBy: [CodeHashChangeOrderByInput!] ) {
  contracts(where: {id_eq: $id}) {
    createdAt
    id
    salt
    trieId
    storageInfo {
      storageBaseDeposit
      storageByteDeposit
      storageItemDeposit
      storageItems
      storageBytes
    }
    deployer {
      id
      contract {
        id
      }
    }
    contractCode {
      code
      id
      removedAt
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
      blockNumber
      indexInBlock
      createdAt
      hash
      name
      signer
      signature
      tip
      versionInfo
      args
    }
    terminatedAt
    terminatedFrom {
      blockNumber
      indexInBlock
      createdAt
      name
      tip
      args
    }
    terminationBeneficiary {
      id
    }
    codeHashChanges(orderBy: $codeHashChangeOrderBy) {
      id
      newCodeHash
      oldCodeHash
      changedAt
      extrinsic {
        indexInBlock
        blockNumber
      }
    }
  }
}
`

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
    variables: { id: params.id, codeHashChangeOrderBy: "changedAt_DESC" }
  })

  const { data, fetching } = result

  if (fetching) {
    return <PageLoading loading={fetching} />
  }

  if (data?.contracts[0] === undefined) {
    return <div className="m-3">Contract not found.</div>
  }

  const {
    id,
    createdAt,
    deployer,
    createdFrom,
    contractCode,
    account,
    storageInfo,
    terminatedAt,
    terminatedFrom,
    terminationBeneficiary,
    codeHashChanges
  } = data?.contracts[0] as Contract
  const { balance } = account
  const isUpgraded = codeHashChanges && codeHashChanges.length > 0
  const salt = getArg(createdFrom.args, "salt")

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
                    <CodeBadge/>
                  </AccountAddress>
                </Copy>
              }
              tag={
                <>
                  <Tag label="wasm" />
                  {isUpgraded && <Tag label="upgraded" />}
                  {terminatedAt && <Tag label="terminated" />}
                </>
              }
            />
            <Segment>
              <DefinitionList>
                <Definition label="Created on" term={
                  <span>{longDateTime(createdAt)}</span>
                }/>
                <Definition label="Deployer" term={
                  <AccountLink account={deployer} size={21} />
                } />
                <Definition label="Code Hash" term={
                  <CodeLink id={contractCode.id} />
                }/>
                {typeof salt === "string" && (salt as string).length > 2 &&
                  <Definition label="Salt" term={
                    <HexText short={true}>{salt}</HexText>
                  }/>
                }
              </DefinitionList>
            </Segment>

            <ExtrinsicSummary
              title="Creation Details"
              extrinsic={createdFrom}
              token={token}
              isOpen={false}
            />
            <>
              {terminatedFrom && <ContractTermination
                title="Termination Details"
                extrinsic={terminatedFrom}
                beneficiary={terminationBeneficiary}
                isOpen={false}
              />}
            </>
            <>
              {isUpgraded && <ContractUpgrades codeHashChanges={codeHashChanges}/>}
            </>
          </Box>
          <Box className="divide-y">
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
            { storageInfo &&
            <Segment title="Storage">
              <DefinitionList>
                <Definition
                  className="justify-between"
                  label="Base"
                  term={<AccountUnit
                    amount={storageInfo.storageBaseDeposit}
                    token={token}
                  />}
                />
              </DefinitionList>
            </Segment>
            }
          </Box>
        </div>

        <Box className="mt-2">
          <Tabs items={tabs} />
        </Box>
      </div>
    </>
  )
}
