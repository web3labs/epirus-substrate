import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import CodeLink from "./CodeLink"

test("Code link contains a link", () => {
  const {
    container
  } = render(
    <MemoryRouter initialEntries={["/codes"]}>
      <CodeLink
        id="0x38ec0f8fde303c179bcabaa40e987d6da361c664438f866a9967e58f92c39b56"
      />
    </MemoryRouter>
  )

  const link = container.getElementsByTagName("a")

  expect(link.length).toBe(1)
  expect(link[0].href).toBe("http://localhost/codes/0x38ec0f8fde303c179bcabaa40e987d6da361c664438f866a9967e58f92c39b56")
})
