import React from "react"
import { formatBalance } from "@polkadot/util"

import { useParams } from "react-router-dom"
import { useChainProperties } from "../../contexts/ChainContext"
import useSquid from "../../hooks/useSquid"
import { Contract } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import Box from "../Box"
import AccountAddress from "../substrate/AccountAddress"
import ListContractActivities from "./ListContractActivities"
import Segment from "../Segment"
import { classNames } from "../../utils/strings"
import { argValue } from "../../utils/types"
import AccountLink from "../AccountRef"
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

function ActivityTab ({ id }: {id:string}) {
  return (
    <ListContractActivities
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

export default function ContractPage () {
  const { tokenDecimals, tokenSymbol } = useChainProperties()
  const params = useParams()
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
    return <p>...</p>
  }
  if (error) return <p>Oh no... {error.message}</p>

  const { id, salt, createdAt, deployer, createdFrom, contractCode, account } = data?.contracts[0] as Contract
  const { balance } = account

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
        <Box className="col-span-2 divide-y">
          <h3 className="px-5 py-4 w-full font-medium">
            <AccountAddress address={id}><CodeBadge/></AccountAddress>
          </h3>
          <Segment>
            <DefinitionList>
              <Definition label="Code Hash" term={
                <span className="font-mono overflow-hidden text-ellipsis">{contractCode.id}</span>
              }/>
              <Definition label="Type" term="WASM" />
            </DefinitionList>
          </Segment>

          <Segment title="Creation details" collapsable={true} isOpen={false}>
            <DefinitionList>
              <Definition label="ID" term={
                <span className="font-mono">{createdFrom.id}</span>
              }/>
              <Definition label="Time" term={createdAt.toString()}/>
              <Definition label="Salt" term={salt &&
                <span className="font-mono">{salt}</span>
              }/>
              <Definition label="Data" term={
                <span className="font-mono">{argValue(createdFrom.args, "data")}</span>
              } />
              <Definition label="Deployer" term={
                <AccountLink account={deployer} />
              } />
            </DefinitionList>
          </Segment>
        </Box>
        <Box>
          <Segment title="Balance">
            <DefinitionList>
              <Definition
                className="justify-between"
                label="Free"
                term={formatBalance(balance.free, { decimals: tokenDecimals, forceUnit: tokenSymbol })}
              />
              <Definition
                className="justify-between"
                label="Reserved"
                term={formatBalance(balance.reserved, { decimals: tokenDecimals, forceUnit: tokenSymbol })}
              />
            </DefinitionList>
          </Segment>
        </Box>
      </div>

      <Box className="mt-2">
        <div className="border-b border-gray-200 w-full">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
            <li className="mr-2">
              <a href="#" className="inline-flex p-4 text-purple-600 rounded-t-lg border-b-2 border-purple-600 active group" aria-current="page">
                Activity
              </a>
            </li>
            <li className="mr-2">
              <a href="#" className="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 group">
                Events
              </a>
            </li>
            <li className="mr-2">
              <a href="#" className="inline-flex p-4 rounded-t-lg border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 group">
                XXX
              </a>
            </li>
            <li>
              <a className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed">Disabled</a>
            </li>
          </ul>
        </div>
        <div className="w-full">
          <ActivityTab id={id} />
        </div>
      </Box>
    </>
  )
}
