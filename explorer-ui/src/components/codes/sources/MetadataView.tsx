/* eslint-disable camelcase */
import { InformationCircleIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import React, { useState } from "react"
import { Definition } from "../../commons/Definitions"

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

export default function MetadataView ({ metadata }: {metadata: ContractMetadata}) {
  const [open, setOpen] = useState(false)
  const { contract, source } = metadata
  const { build_info } = source

  function toggleOpen () {
    setOpen(prev => !prev)
  }
  return (
    <div className="flex flex-col gap-4 text-gray-700">
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold text-gray-500">Contract Information</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-2">
            <Definition label="Name" term={
              <span>{contract.name}</span>
            }/>
            <Definition label="Authors" term={
              <div>
                {contract.authors.map(a => (<span key={a}>{a}</span>))}
              </div>
            }/>
            <Definition label="Verification" term={
              <div className="flex gap-1 items-center">
                <span>Bytecode Match</span>
                <InformationCircleIcon className="h-4 w-4"/>
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
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex cursor-pointer items-center" onClick={toggleOpen}>
          <div className="text-sm font-semibold text-gray-500">Build Information</div>
          {open
            ? <ChevronDownIcon className="h-4 w-4"/>
            : <ChevronRightIcon className="h-4 w-4"/> }
        </div>
        { open &&
        <div className="flex flex-col gap-2">
          <table className="w-1/3 table-auto border-collapse border border-slate-300 text-xs">
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
        </div>
        }
      </div>
    </div>
  )
}
