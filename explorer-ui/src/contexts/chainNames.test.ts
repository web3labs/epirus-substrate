import resolveInfoFromName from "./chainNames"

test("Unknown chain", () => {
  expect(() => resolveInfoFromName("no name")).toThrowError()
})

test("Local chain info", () => {
  expect(resolveInfoFromName("local contracts chain")).toEqual("local")
})

test("Rococo chain ingo", () => {
  expect(resolveInfoFromName("contracts on rococo")).toEqual("rococoContracts")
})

test("Shibuya chain info", () => {
  expect(resolveInfoFromName("shibuya testnet")).toEqual("shibuya")
})
