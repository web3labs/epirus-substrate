import { formatUnits } from "./units"

test("format 1 USD", () => {
  expect(formatUnits("1000", { tokenDecimals: 3, tokenSymbol: "USD" })).toEqual("1 USD")
})

test("format 10 USD", () => {
  expect(formatUnits("10000", { tokenDecimals: 3, tokenSymbol: "USD" })).toEqual("10 USD")
})

test("format 0.1 USD", () => {
  expect(formatUnits("100", { tokenDecimals: 3, tokenSymbol: "USD" })).toEqual("0.1 USD")
})

test("format 0.001 USD", () => {
  expect(formatUnits("1", { tokenDecimals: 3, tokenSymbol: "USD" })).toEqual("0.001 USD")
})

test("format 1 wei", () => {
  expect(formatUnits("1", { tokenDecimals: 18, tokenSymbol: "ETH" })).toEqual("0.000000000000000001 ETH")
})

test("format 10 ETH", () => {
  expect(formatUnits(10e18, { tokenDecimals: 18, tokenSymbol: "ETH" })).toEqual("10 ETH")
})

test("format -10 ETH", () => {
  expect(formatUnits(-10e18, { tokenDecimals: 18, tokenSymbol: "ETH" })).toEqual("-10 ETH")
})

test("format 0 ETH", () => {
  expect(formatUnits(0, { tokenDecimals: 18, tokenSymbol: "ETH" })).toEqual("0 ETH")
})
