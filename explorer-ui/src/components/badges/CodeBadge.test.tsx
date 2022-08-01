import React from "react"
import { render } from "@testing-library/react"
import CodeBadge from "./CodeBadge"

test("Code badge", () => {
  const { container } = render(
    <CodeBadge />
  )

  const icon = container.getElementsByTagName("svg")
  expect(icon).toBeDefined()
})
