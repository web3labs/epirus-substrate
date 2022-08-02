import { formatBalance } from "@polkadot/util"

export function formatUnits (
  amount: number | string | undefined,
  token: {tokenDecimals: number, tokenSymbol:string}
) {
  const amt = amountToString(amount)
  const formatted = amt.length > token.tokenDecimals
    ? formatBalance(amt, {
      decimals: token.tokenDecimals,
      withUnit: token.tokenSymbol,
      forceUnit: token.tokenSymbol
    })
    : formatSmallBalance(amt, { decimals: token.tokenDecimals, symbol: token.tokenSymbol })
  return removeTrailingZeros(formatted)
}

/**
 * For formatting very small units of currency that show as 0 using formatBalance of @polkadotjs/utils
 * We take just the first 2 digits of the amount since there would already be many zeros leading up to the decimal point
 * @param amount amount in Planck
 * @param tokenConfig currency config
 * @returns formatted amount with currency symbol
 */
function formatSmallBalance (amount: string, tokenConfig: { decimals: number, symbol: string }): string {
  if (amount === "0") {
    return [amount, tokenConfig.symbol].join(" ")
  }
  const numberOfLeadingZeros = tokenConfig.decimals > amount.length ? tokenConfig.decimals - amount.length : 0
  const decimalArray = Array(numberOfLeadingZeros).fill("0")
  decimalArray.push(amount)
  return `0.${decimalArray.join("").substring(0, numberOfLeadingZeros + 2)} ${tokenConfig.symbol}`
}

function amountToString (amount: string | number | undefined): string {
  let amt = amount || 0
  if (typeof amt === "number") {
    amt = amt.toString()
  }
  return amt
}

function removeTrailingZeros (amount: string): string {
  const [amt, symbol] = amount.split(" ")
  const [whole, decimals] = amt.split(".")

  if (decimals === undefined) {
    return amount
  }

  const decArray = decimals.split("")
  for (let i = decArray.length - 1; i >= 0; i--) {
    if (decimals[i] !== "0") {
      break
    }
    decArray.pop()
  }
  if (decArray.length === 0) {
    return [whole, symbol].join(" ")
  }

  return `${whole}.${decArray.join("")} ${symbol}`
}
