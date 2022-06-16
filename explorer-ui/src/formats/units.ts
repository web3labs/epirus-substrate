import { formatBalance } from "@polkadot/util"

export function formatUnits (
  amount: number | string | undefined,
  token: {tokenDecimals: number, tokenSymbol:string}
) {
  return formatBalance(amount || 0, {
    decimals: token.tokenDecimals,
    withUnit: token.tokenSymbol,
    forceUnit: token.tokenSymbol
  })
}
