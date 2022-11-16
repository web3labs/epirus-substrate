/* eslint-disable camelcase */
import React, { useEffect, useState } from "react"
import { CheckBadgeIcon } from "@heroicons/react/24/solid"

import hljs from "../../../highlight"

import api from "../../../apis/verifierApi"
import { errMsg } from "../../../utils/errors"
import { Warning } from "../../commons/Alert"
import { Definition } from "../../commons/Definitions"
import Segment from "../../commons/Segment"
import SourceCodeView from "./SourceCode"
import { PageLoading } from "../../loading/Loading"

export interface ContractMetadata {
  source: {
    hash: string
    language: string
    compiler: string
    wasm: string
    build_info: {
      build_mode: string,
      cargo_contract_version: string,
      rust_toolchain: string,
      wasm_opt_settings: {
          keep_debug_symbols: boolean,
          optimization_passes: string
      }
  }
  },
  contract: {
    name: string
    version: string
    authors: string[]
  }
  spec: JSON
  storage: JSON
  types: JSON
  version: string
}

export default function MetadataView (
  { codeHash } :
  { codeHash: string }
) {
  const [metadata, setMetadata] = useState<ContractMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData () {
      try {
        const res = await api.metadata(codeHash)
        if ("source" in res) {
          setMetadata(res)
        } else {
          setError(res.message)
        }
      } catch (error: unknown) {
        setError(errMsg(error))
      }
    }

    fetchData()
  }, [])

  if (error !== null) {
    return <Warning title="Error" message={error} />
  }

  if (metadata == null) {
    return <PageLoading loading={true} />
  }

  const { contract, source } = metadata
  const { build_info } = source
  const metadataAsString = JSON.stringify(metadata, null, 2)
  const { value } = hljs.highlight(metadataAsString, { language: "json" })

  return (
    <div className="flex flex-col gap-4 divide-y">
      <Segment
        collapsable={true}
        isOpen={true}
        title="Contract"
      >
        <div className="md:grid md:grid-cols-2 md:gap-2">
          <div className="flex flex-col gap-2">
            <Definition label="Name" term={
              <span>{contract.name}</span>
            }/>
            <Definition label="Verification" term={
              <div className="flex gap-1 items-center text-sm">
                <span>Bytecode Match</span>
                <div className="flex items-center group">
                  <CheckBadgeIcon className="text-green-600" height={18} width={18}/>
                  <span
                    className="absolute mx-5 p-2 text-xs text-gray-50 border rounded border-gray-700
                                 bg-gray-700 text-wrap max-w-xs invisible group-hover:visible"
                  >
                          The source code files were compiled and the output matched against the Wasm blob deployed on-chain.
                  </span>
                </div>
              </div>
            }/>
          </div>
          <div className="flex flex-col gap-2">
            <Definition label="Language" term={
              <span>{source.language}</span>
            }/>
            <Definition label="Compiler" term={
              <span>{source.compiler}</span>
            }/>
          </div>
          <div className="md:col-span-2">
            <Definition label="Authors" term={
              <div className="flex flex-col gap-2">
                {contract.authors.map((a, i) => (<div key={`${i}-${a}`}>{a}</div>))}
              </div>
            }/>
          </div>
        </div>
      </Segment>
      <Segment
        collapsable={true}
        isOpen={false}
        title="Build Info"
        className="items-start"
      >
        <table className="table-auto border-collapse border border-slate-300 text-xs">
          <tbody>
            <tr className="p-2">
              <td className="border border-slate-300 py-2 px-4">Build Mode</td>
              <td className="border border-slate-300 py-2 px-4 font-mono">{build_info.build_mode}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 py-2 px-4">Cargo Contract Version</td>
              <td className="border border-slate-300 py-2 px-4 font-mono">{build_info.cargo_contract_version}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 py-2 px-4">Rust Toolchain</td>
              <td className="border border-slate-300 py-2 px-4 font-mono">{build_info.rust_toolchain}</td>
            </tr>
            <tr>
              <td className="border border-slate-300 py-2 px-4">Wasm Opt Passes</td>
              <td className="border border-slate-300 py-2 px-4 font-mono">{build_info.wasm_opt_settings.optimization_passes}</td>
            </tr>
          </tbody>
        </table>
      </Segment>
      <Segment
        collapsable={true}
        isOpen={false}
        title="Metadata"
      >
        <SourceCodeView name={"metadata.json"} content={metadataAsString} htmlContent={value} />
      </Segment>
    </div>
  )
}
