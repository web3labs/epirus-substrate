class ValueUnit {
  symbol: string
  decimals: number
  factor: bigint

  constructor (symbol: string, decimals: number, factor: bigint) {
    this.symbol = symbol
    this.decimals = decimals
    this.factor = factor
  }

  as (v: bigint | number | string) : bigint {
    return BigInt(v) / this.factor
  }
}

export const VALUE_UNITS : {[key: string]: ValueUnit} = {
  planck: new ValueUnit(
    "Planck",
    0,
    BigInt(0)
  ),
  dot: new ValueUnit(
    "DOT",
    10,
    BigInt(1E10)
  )
}
