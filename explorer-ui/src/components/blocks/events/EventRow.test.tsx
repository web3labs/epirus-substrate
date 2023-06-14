import React from "react"
import { render } from "@testing-library/react"
import EventRow from "./EventRow"
import { mockBlockEvent } from "../../../_mocks/data"
import { MemoryRouter } from "react-router-dom"
import { LightExtrinsic } from "../../../types/extrinsic"
import { Event } from "../../../types/blocks"

describe("Event row component", () => {
  it("should render long event row", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/blocks/0x123"]}>
        <EventRow
          obj={ mockBlockEvent(1) as unknown as Event }
          short={false}
        />
      </MemoryRouter>
    )

    expect(container.getElementsByTagName("li").length).toBe(1)
  })

  it("should render short event row", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/blocks/0x123"]}>
        <EventRow
          obj={ mockBlockEvent(1) as unknown as Event }
          short={true}
        />
      </MemoryRouter>
    )

    expect(container.getElementsByTagName("li").length).toBe(1)
  })
})
