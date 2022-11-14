import React, { useMemo } from "react"

import { useParams } from "react-router-dom"
import useSquid from "../../hooks/useSquid"
import Box, { BoxHead } from "../commons/Box"
import Segment from "../commons/Segment"
import AccountLink from "../accounts/AccountLink"
import Breadcrumbs from "../navigation/Breadcrumbs"
import Tag from "../commons/Tag"
import Tabs, { TabItem } from "../navigation/Tabs"
import { Definition, DefinitionList } from "../commons/Definitions"
import { ContractCode } from "../../types/codes"
import { useChainProperties } from "../../contexts/ChainContext"
import ContractTab, { contractByCodeHash } from "../contracts/ContractTab"
import BinaryTab from "./BinaryTab"
import Copy from "../commons/Copy"
import ExtrinsicSummary from "../commons/ExtrinsicSummary"
import { getArg } from "../../utils/args"
import { longDateTime } from "../../formats/time"
import CodeHash from "./CodeHash"
import { PageLoading } from "../loading/Loading"
import SourceTab from "./sources/SourceTab"

const SOURCE_CODE_ENABLED = (
  window.__RUNTIME_CONFIG__?.REACT_APP_SOURCE_CODE_ENABLED ||
    process.env.REACT_APP_SOURCE_CODE_ENABLED ||
    "false") === "true"

const QUERY = `
query($id: String!) {
  contractCodes(where: {id_eq: $id}) {
    id
    createdAt
    createdFrom {
      blockNumber
      indexInBlock
      name
      createdAt
      tip
      args
    }
    owner {
      id,
      contract {
        id
      }
    }
    contractsDeployed {
      id
    }
    removedAt
    removedFrom {
      blockNumber
      indexInBlock
      name
      createdAt
      tip
      args
    }
  }
}
`

export default function CodePage () {
  const { token } = useChainProperties()
  const params = useParams()
  const [result] = useSquid({
    query: QUERY,
    variables: { id: params.id }
  })

  const { data, fetching } = result

  const tabs : TabItem[] = useMemo(() => {
    if (params.id) {
      const _tabs = [
        {
          label: "Instances",
          to: "",
          element: <ContractTab
            currentId={params.id}
            where={contractByCodeHash(params.id)}
          />
        }
      ]
      if (SOURCE_CODE_ENABLED) {
        _tabs.push({
          label: "Source Code",
          to: "sources",
          element: <SourceTab id={params.id} />
        })
      }
      _tabs.push({
        label: "Bytecode",
        to: "bytecode",
        element: <BinaryTab id={params.id} />
      })

      return _tabs
    }
    return []
  }, [params.id, fetching])

  if (fetching) {
    return <PageLoading loading={fetching} />
  }

  if (data?.contractCodes[0] === undefined) {
    return <span>Contract code not found</span>
  }

  const { id, createdAt, owner, createdFrom, removedFrom } = data?.contractCodes[0] as ContractCode
  const depositLimit = getArg(createdFrom.args, "storageDepositLimit")

  return (
    <>
      <Breadcrumbs/>
      <div className="content">
        <Box className="divide-y">
          <BoxHead
            title={
              <Copy text={id}>
                <CodeHash hash={id} size={21} />
              </Copy>
            }
            tag={<Tag label="wasm" />}
          />
          <Segment>
            <DefinitionList>
              <Definition label="Created on" term={
                <span>{longDateTime(createdAt)}</span>
              }/>
              <Definition label="Owner" term={
                <AccountLink account={owner} size={21} />
              }/>
              <Definition label="Deposit" term={
                <span className="font-mono">
                  {depositLimit || "unlimited"}
                </span>
              }/>
            </DefinitionList>
          </Segment>

          <ExtrinsicSummary
            title="Creation Details"
            extrinsic={createdFrom}
            token={token}
            isOpen={false}
          />
          <>
            {removedFrom && <ExtrinsicSummary
              title="Removal Details"
              extrinsic={removedFrom}
              token={token}
              isOpen={false}
            />}
          </>
        </Box>

        <Box className="mt-2">
          <Tabs items={tabs} />
        </Box>
      </div>
    </>
  )
}
