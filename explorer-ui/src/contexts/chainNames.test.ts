import resolveInfoFromName from "./chainNames"

test("Unknown chain", () => {
  expect(() => resolveInfoFromName("no name")).toThrowError()
})

test("alephzero chain info", () => {
  expect(resolveInfoFromName("aleph zero")).toEqual("aleph-testnet")
})

test("Local chain info", () => {
  expect(resolveInfoFromName("local contracts chain")).toEqual("local")
})

test("Rococo chain info", () => {
  expect(resolveInfoFromName("contracts on rococo")).toEqual("rococoContracts")
})

test("Shibuya chain info", () => {
  expect(resolveInfoFromName("shibuya testnet")).toEqual("shibuya")
})

test("watr testnet chain info", () => {
  expect(resolveInfoFromName("watr network testnet")).toEqual("rococoWatr")
})
