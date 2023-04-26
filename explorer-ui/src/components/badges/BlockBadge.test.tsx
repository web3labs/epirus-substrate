import React from "react"
import { render } from "@testing-library/react"
import BlockBadge from "./BlockBadge"

test("Check badge", () => {
  const { container } = render(
    <BlockBadge />
  )

  const icon = container.getElementsByTagName("svg")
  expect(icon).toBeDefined()
})
