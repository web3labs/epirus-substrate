import React, { useMemo } from "react"

import { useParams } from "react-router-dom"
import useSquid from "../../hooks/useSquid"
import Box from "../commons/Box"
import Segment from "../commons/Segment"
import AccountLink from "../accounts/AccountLink"
import Breadcrumbs from "../Breadcrumbs"
import Tag from "../Tag"
import Tabs, { TabItem } from "../Tabs"
import { Definition, DefinitionList } from "../commons/Definitions"
import { ContractCode } from "../../types/codes"

const QUERY = `
query($id: ID!) {
  contractCodes(where: {id_eq: $id}) {
    id
    code
    createdAt
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
    owner {
      id,
      contract {
        id
      }
    }
    contractsDeployed {
      id
    }
    removedOn
  }
}
`

export default function CodePage () {
  // const { token } = useChainProperties()

  const params = useParams()

  const tabs : TabItem[] = useMemo(() => {
    if (params.id) {
      return [
        {
          label: "Instances",
          to: "",
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

  const { id, createdAt, owner, createdFrom } = data?.contractCodes[0] as ContractCode

  return (
    <>
      <Breadcrumbs/>
      <div className="content">

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
          <Box className="col-span-2 divide-y gap-y-2">
            <div className="flex flex-row flex-wrap w-full items-start justify-between mt-4 gap-x-2">
              <h3 className="mx-5 mb-1 font-medium">
                {id}
              </h3>
              <div className="flex flex-row flex-wrap gap-x-2 px-4">
                <Tag label="wasm" />
              </div>
            </div>
            <Segment>
              <DefinitionList>
                <Definition label="Owner" term={
                  <AccountLink account={owner} size={21} />
                }/>
              </DefinitionList>
            </Segment>

            <Segment title="Creation details" collapsable={true} isOpen={false}>
              <DefinitionList>
                <Definition label="Block" term={
                  <span className="font-mono">{createdFrom.blockNumber}</span>
                }/>
                <Definition label="Extrinsic" term={
                  <span className="font-mono">{createdFrom.id}</span>
                }/>
                <Definition label="Time" term={createdAt.toString()}/>
              </DefinitionList>
            </Segment>
          </Box>
          <Box>
            <span>....</span>
          </Box>
        </div>

        <Box className="mt-2">
          <Tabs items={tabs} />
        </Box>
      </div>
    </>
  )
}
