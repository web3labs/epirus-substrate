/* eslint-disable camelcase */

import React from "react"

import json from "./data/extrinsics.json"
import { ContractExtrinsic } from "../types/Extrinsics"
import ExtrinsicRow from "../components/substrate/ExtrinsicRow"

interface Arg {
  name: string, type: string, value: string
}
function argValue (args: [Arg], name: string) {
  return args.find(a => a.name === name)?.value as string
}

export default function MockContractCalls () {
  return json.data.substrate_extrinsic.map(({ args, method, id, signer, hash, created_at, substrate_events }) => {
    const events = substrate_events as unknown as Array<{ method: string, params: Array<{ value: string }> }>

    let dest = (args.find(a => a.name === "dest")?.value as any)?.id
    let codeHash = argValue(args as [Arg], "codeHash")

    switch (method) {
      case "instantiate": {
        dest = events.find(ev => ev.method === "Instantiated")
          ?.params[1]?.value
        break
      }
      case "instantiateWithCode": {
        dest = events.find(ev => ev.method === "Instantiated")
          ?.params[1]?.value
        codeHash = events.find(ev => ev.method === "CodeStored")?.params[0]?.value as string
        break
      }
    }
    const gasLimit = argValue(args as [Arg], "gasLimit")
    const data = argValue(args as [Arg], "data")
    const value = argValue(args as [Arg], "value")

    const extrinsicData: ContractExtrinsic = {
      id,
      data,
      method,
      createdAt: created_at,
      hash,
      gasLimit,
      dest,
      signer,
      value,
      codeHash
    }
    return <ExtrinsicRow key={id} extrinsic={extrinsicData} />
  })
}
