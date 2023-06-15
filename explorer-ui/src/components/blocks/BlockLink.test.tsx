import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import BlockLink from "./BlockLink"
import { mockBlock } from "../../_mocks/data"

describe("BlockLink component", () => {
  it("should render a block link", () => {
    const {
      container
    } = render(
      <MemoryRouter initialEntries={["/blocks"]}>
        <BlockLink
          block={mockBlock(1)}
        />
      </MemoryRouter>)
    const link = container.getElementsByTagName("a")

    expect(link.length).toBe(1)
    expect(link[0].href).toBe("http://localhost/blocks/0x123")
  })
})
