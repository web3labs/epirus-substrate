import React from "react"
import { render } from "@testing-library/react"
import AccountAddress from "./AccountAddress"

test("Account address displays the identicon", () => {
  const {
    container
  } = render(
    <AccountAddress
      address="5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL"
    />
  )
  const identicon = container.getElementsByTagName("svg")

  expect(container.children.length).toBe(1)
  expect(identicon.length).toBe(1)
})

test("Avoid display when address is empty", () => {
  const {
    container
  } = render(
    <AccountAddress address="" />
  )

  expect(container.children.length).toBe(0)
})
