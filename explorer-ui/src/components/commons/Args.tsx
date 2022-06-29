import { argValue } from "../../utils/types"
import { formatUnits } from "../../formats/units"
import { Arg } from "../../types/extrinsic"
import { TokenProps } from "../../types/chain"

export function printBalance (args: Arg[] | undefined, token: TokenProps) {
  if (args === undefined || args.length === 0) {
    return null
  }

  const va = argValue(args, "value")
  if (va === "0") {
    return null
  }
  return formatUnits(va, token)
}
