import { formatUnits } from "../../formats/units"
import { TokenProps } from "../../types/chain"
import { Args } from "../../types/extrinsic"
import { argValue } from "../../utils/types"

export function formatValue (args: Args | undefined | null, token: TokenProps, name: string = "value") {
  if (args === undefined || args === null) {
    return null
  }

  const va = argValue(args, name)
  if (va === "0") {
    return null
  }
  return formatUnits(va, token)
}
