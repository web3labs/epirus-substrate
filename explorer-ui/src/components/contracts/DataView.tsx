import React, { useState } from "react"
import { DecodedArg, DecodedElement } from "../../types/contracts"
import { classNames } from "../../utils/strings"

export default function DataView ({
  rawData,
  decodedData
} : {
  rawData: string | number | undefined
  decodedData?: DecodedElement
}) {
  if (!rawData) {
    return null
  }
  if (!decodedData) {
    return (
      <div className="flex flex-col gap-y-2 py-2 w-full">
        <div className="text-sm text-gray-400">Data</div>
        <RawDataView rawData={rawData}/>
      </div>

    )
  }

  const [displayDecoded, setDisplayDecoded] = useState(true)

  function setDecodedToggle (toggle: boolean) {
    setDisplayDecoded(toggle)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2 w-full">
        <div className="flex gap-2 text-sm justify-between items-start">
          <div className="text-gray-400 md:basis-20">Data</div>
          <div className="inline-flex rounded-md">
            <ToggleButton title={"Decoded"} isSelected={displayDecoded} placement={"left"} onClick={() => setDecodedToggle(true)}/>
            <ToggleButton title={"Raw"} isSelected={!displayDecoded} placement={"right"} onClick={() => setDecodedToggle(false)}/>
          </div>
        </div>
        <div className="overflow-auto w-full">
          {displayDecoded
            ? <DecodedDataView decodedData={decodedData}/>
            : <RawDataView rawData={rawData}/>}
        </div>
      </div>
    </>
  )
}

function ToggleButton ({
  title,
  isSelected,
  placement,
  onClick
} : {
  title: string,
  isSelected: boolean
  placement: "left" | "right" | "middle"
  onClick: () => void
}) {
  let roundedBorder = ""
  if (placement === "left") {
    roundedBorder = "rounded-l"
  } else if (placement === "right") {
    roundedBorder = "rounded-r"
  }
  return (
    <button type="button"
      className={
        classNames(
          "px-2 py-1 border border-blue-200 text-gray-800",
          roundedBorder,
          isSelected
            ? "bg-blue-200 cursor-default"
            : "hover:bg-gray-200 hover:text-gray-900"
        )
      }
      onClick={onClick}>{title}</button>
  )
}

function RawDataView ({ rawData }: {rawData: string | number }) {
  return (<div className="py-2 px-4 text-sm font-mono break-all border border-slate-300">{rawData}</div>)
}

function DecodedDataView ({ decodedData }: {decodedData: DecodedElement}) {
  return (
    <table className="table-auto border-collapse border border-slate-300 text-sm w-full">
      <tbody>
        <tr className="p-2">
          <td className="border border-slate-300 text-gray-400 py-2 px-4 w-28">Method</td>
          <td className="border border-slate-300 py-2 px-4 font-mono">{decodedData.name}</td>
        </tr>
        { decodedData.args && decodedData.args.length > 0 &&
        <tr>
          <td className="border border-slate-300 text-gray-400 py-2 px-4">Parameters</td>
          <td>
            <table className="border-collapse table-auto text-sm w-full">
              <thead>
                <tr>
                  <th className="border-b border-slate-300 text-gray-400 py-2 px-4 font-normal w-28">Name</th>
                  <th className="border-b border-slate-300 text-gray-400 py-2 px-4 font-normal w-20">Type</th>
                  <th className="border-b border-slate-300 text-gray-400 py-2 px-4 font-normal">Value</th>
                </tr>
              </thead>
              <tbody>
                { decodedData.args.map((arg: DecodedArg) => {
                  return (
                    <tr key={arg.id} className="p-2">
                      <td className="border-t border-slate-300 py-2 px-4 font-mono">{arg.name}</td>
                      <td className="border-t border-slate-300 py-2 px-4 font-mono">{arg.type}</td>
                      <td className="border-t border-slate-300 py-2 px-4 font-mono">{arg.value || "-"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </td>
        </tr>
        }
      </tbody>
    </table>)
}
