import React from "react"
import { render } from "@testing-library/react"
import CrossBadge from "./CrossBadge"

test("Check badge", () => {
  const { container } = render(
    <CrossBadge />
  )

  const icon = container.getElementsByTagName("svg")
  expect(icon).toBeDefined()
})
