import { getArgValue } from "./args"

test("Undefined args", () => {
  expect(getArgValue(null, "lol")).toBeUndefined()
})
