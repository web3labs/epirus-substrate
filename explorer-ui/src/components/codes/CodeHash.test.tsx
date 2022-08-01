import React from "react"
import { render } from "@testing-library/react"
import CodeHash from "./CodeHash"

test("Code hash", () => {
  const { container } = render(
    <CodeHash hash="0x38ec0f8fde303c179bcabaa40e987d6da361c664438f866a9967e58f92c39b56" />
  )

  const icon = container.getElementsByTagName("svg")
  expect(icon).toBeDefined()
})

test("Code hash big", () => {
    const { container } = render(
      <CodeHash
        hash="0x38ec0f8fde303c179bcabaa40e987d6da361c664438f866a9967e58f92c39b56"
        size={80}
      />
    )

    const icon = container.getElementsByTagName("svg")
    expect(icon).toBeDefined()
  })
