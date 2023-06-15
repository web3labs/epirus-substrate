import React from "react"
import { render } from "@testing-library/react"
import ExtrinsicRow from "./ExtrinsicRow"
import { mockLightExtrinsic } from "../../_mocks/data"
import { MemoryRouter } from "react-router-dom"
import { LightExtrinsic } from "../../types/extrinsic"

describe("Extrinsic row component", () => {
  it("should render long extrinsic row", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/blocks/0x123"]}>
        <ExtrinsicRow
          obj={ mockLightExtrinsic(1) as unknown as LightExtrinsic }
          short={false}
        />
      </MemoryRouter>
    )

    expect(container.getElementsByTagName("svg").length).toBe(1)
  })

  it("should render short extrinsic row", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/blocks/0x123"]}>
        <ExtrinsicRow
          obj={ mockLightExtrinsic(1) as unknown as LightExtrinsic }
          short={true}
        />
      </MemoryRouter>
    )

    expect(container.getElementsByTagName("svg").length).toBe(1)
  })
})
