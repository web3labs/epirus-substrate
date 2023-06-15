import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import ExtrinsicLink from "./ExtrinsicLink"
import { mockLightExtrinsic } from "../../_mocks/data"
import { LightExtrinsic } from "../../types/extrinsic"

describe("BlockLink component", () => {
  it("should render a block link", () => {
    const {
      container
    } = render(
      <MemoryRouter initialEntries={["/blocks"]}>
        <ExtrinsicLink
          extrinsic={mockLightExtrinsic(1) as unknown as LightExtrinsic}
        />
      </MemoryRouter>)
    const link = container.getElementsByTagName("a")

    expect(link.length).toBe(1)
    expect(link[0].href).toBe("http://localhost/extrinsic/1")
  })
})
