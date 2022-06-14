import React from "react"
import { useParams } from "react-router-dom"
import useSquid from "../../hooks/useSquid"
import { Contract } from "../../types/contracts"
import CodeBadge from "../badges/CodeBadge"
import Box from "../Box"
import AccountAddress from "../substrate/AccountAddress"
import ListContractActivities from "./ListContractActivities"
const QUERY = `
query($id: ID!) {
  contracts(where: {id_eq: $id}) {
    deployedOn
    id
    salt
    trieId
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
      storageDeposit
      uploadedOn
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
    }
  }
}
`

function Definition ({ label, term }: {label: string, term: JSX.Element | string}) {
  return (
    <div className="px-2 py-3 grid grid-cols-6 gap-2 items-center">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900 col-span-5">{term}</dd>
    </div>
  )
}

function ActivityTab ({ id }: {id:string}) {
  return (
    <ListContractActivities
      query={{
        where: {
          from_eq: id,
          OR: {
            to_eq: id
          }
        }
      }}
    />
  )
}

export default function ContractPage () {
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

  const { id, deployedOn, deployer, createdFrom, contractCode, account } = data?.contracts[0] as Contract

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-2">
        <Box className="col-span-2">
          <div className="flex flex-col w-full border-b px-4 py-5 sm:px-6">
            <h3 className="uppercase tracking-wider text-xs font-medium text-gray-500">Contract</h3>
            <dl className="w-full">
              <Definition label="ID" term={
                <AccountAddress address={id}><CodeBadge/></AccountAddress>
              } />
              <Definition label="Code Hash" term={
                <span className="font-mono overflow-hidden text-ellipsis">{contractCode.id}</span>
              }/>
              <Definition label="Type" term="WASM" />
            </dl>
          </div>

          <div className="flex flex-col w-full border-b px-4 py-5 sm:px-6">
            <h3 className="uppercase tracking-wider text-xs font-medium text-gray-500">Deployment</h3>
            <dl className="w-full">
              <Definition label="Deployer" term={
                <AccountAddress address={deployer.id} short={false}>
                  {deployer.account && <CodeBadge/>}
                </AccountAddress>
              } />
              <Definition label="ID" term={
                <span className="font-mono">{createdFrom.id}</span>
              }/>
              <Definition label="Timestamp" term={deployedOn.toString()}/>
            </dl>
          </div>
        </Box>
        <Box>
          <div className="flex flex-col w-full border-b px-4 py-5 sm:px-6">
            <h3 className="uppercase tracking-wider text-xs font-medium text-gray-500">Balance</h3>
            <dl className="w-full">
              <Definition label="Free" term={account.balance.free}/>
              <Definition label="Reserved" term={account.balance.reserved} />
            </dl>
          </div>
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
