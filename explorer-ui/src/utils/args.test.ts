import { Args } from "../types/extrinsic"
import { getArgValue } from "./args"

test("Undefined args", () => {
  expect(getArgValue(null, "lol")).toBeNull()
})

test("Default value arg", () => {
  expect(getArgValue({ value: "mike" })).toBe("mike")
})

test("Zero value args", () => {
  const testArgs = {
    a: "0",
    b: "0"
  } as Args

  expect(getArgValue(testArgs, "b")).toBeNull()
})

test("Simple string arg", () => {
  expect(getArgValue({
    name: "xoco"
  }, "name")).toBe("xoco")
})
