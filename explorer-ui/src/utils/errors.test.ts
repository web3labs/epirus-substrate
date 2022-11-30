import { errMsg } from "./errors"

test("Extract error message from string", () => {
  expect(errMsg("error")).toEqual("error")
})

test("Extract error message from Error", () => {
  expect(errMsg(new Error("error"))).toEqual("error")
})

test("Error message from null", () => {
  expect(errMsg(null)).toBeNull()
})
