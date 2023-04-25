import React from "react"
import { render } from "@testing-library/react"
import CheckBadge from "./CheckBadge"

test("Check badge", () => {
  const { container } = render(
    <CheckBadge />
  )

  const icon = container.getElementsByTagName("svg")
  expect(icon).toBeDefined()
})
