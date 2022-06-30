import { argValue } from "../../utils/types"
import { formatUnits } from "../../formats/units"
import { Arg } from "../../types/extrinsic"
import { TokenProps } from "../../types/chain"

export function formatValue (args: Arg[] | undefined, token: TokenProps, name: string = "value") {
  if (args === undefined || args.length === 0) {
    return null
  }

  const va = argValue(args, name)
  if (va === "0") {
    return null
  }
  return formatUnits(va, token)
}
