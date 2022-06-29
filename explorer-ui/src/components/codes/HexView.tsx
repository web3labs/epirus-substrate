import React, { useMemo } from "react"

import { bytestoAscii, hexify } from "../../utils/hex"

function OffsetHead (width = 16): string {
  return [...Array(width)].map((_, n) => hexify(n, 2)).join(" ")
}

export function HexView ({ bytes, width = 16 }: { bytes: Uint8Array; width?: number }) {
  const hexRows = useMemo(() => {
    const rows = []

    for (let offset = 0; offset < bytes.length; offset += width) {
      const rowBytes = bytes.slice(offset, offset + width)

      rows.push(<HexRow key={offset} offset={offset} bytes={rowBytes} />)
    }

    return rows
  }, [bytes, width])

  return (
    <div className="inline-block border max-h-64 max-w-full whitespace-pre overflow-auto scroll-smooth font-mono text-sm">
      <table className="border-collapse">
        <thead>
          <tr className="sticky top-0 py-1 px-2 text-zinc-400 select-none bg-zinc-100 drop-shadow">
            <th className="font-semibold text-xs">OFFSET</th>
            <th className="align-left font-semibold">{OffsetHead()}</th>
            <th className="font-semibold text-xs">ASCII</th>
          </tr>
        </thead>
        <tbody>{hexRows}</tbody>
      </table>
    </div>
  )
}

function HexRow ({ bytes, offset }: { bytes: Uint8Array; offset: number }) {
  const hexBytes = bytes
    .reduce((arr, byte) => {
      arr.push(hexify(byte, 2))
      return arr
    }, [] as string[])
    .join(" ")

  return (
    <tr>
      <td className="px-2 py-1 select-none border-r text-zinc-400 bg-zinc-100 font-semibold">
        {hexify(offset, 8)}
      </td>
      <td className="px-2 py-1">{hexBytes}</td>
      <td className="px-2 py-1 select-none border-l text-zinc-600">
        {bytestoAscii(bytes)}
      </td>
    </tr>
  )
}
