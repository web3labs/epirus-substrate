import React from "react"
import { render } from "@testing-library/react"
import BlockRow from "./BlockRow"
import { MemoryRouter } from "react-router-dom"
import { mockBlock } from "../../_mocks/data"
import { LightBlock } from "../../types/blocks"

describe("Block row component", () => {
  it("should render long block row", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/blocks"]}>
        <BlockRow
          obj={mockBlock(1) as LightBlock}
          short={false}
        />
      </MemoryRouter>
    )

    expect(container.getElementsByTagName("svg").length).toBe(2)
  })

  it("should render short block row", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/blocks"]}>
        <BlockRow
          obj={ mockBlock(1) as LightBlock }
          short={true}
        />
      </MemoryRouter>
    )

    expect(container.getElementsByTagName("svg").length).toBe(2)
  })
})
