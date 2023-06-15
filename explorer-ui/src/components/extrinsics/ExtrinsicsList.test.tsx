import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Provider } from "urql"
import ExtrinsicsList from "./ExtrinsicsList"
import { createMockClient } from "../../_mocks/mockClient"
import { emptyMockPage, mockPageOf } from "../../_mocks/utils"
import { mockLightExtrinsicEdges } from "../../_mocks/data"

describe("ExtrinsicsList component", () => {
  it("should render an empty list when there is no data to show", () => {
    const mockClient = createMockClient({
      extrinsicsConnection: emptyMockPage()
    })

    render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/blocks/0x123"]}>
          <ExtrinsicsList
            key="0"
            title="Test List"
          />
        </MemoryRouter>
      </Provider>
    )

    const title = screen.getByText(/Test List/i)
    expect(title).toBeInTheDocument()
    const emptyList = screen.getByText(/No extrinsics to show/i)
    expect(emptyList).toBeInTheDocument()
  })

  it("should display the first page of a paginated response data", () => {
    const mockClient = createMockClient({
      extrinsicsConnection: mockPageOf(mockLightExtrinsicEdges)
    })

    const { container } = render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/blocks/0x123"]}>
          <ExtrinsicsList
            key="0"
            title="Test List"
            short={false}
          />
        </MemoryRouter>
      </Provider>
    )

    const title = screen.getByText(/Test List/i)
    expect(title).toBeInTheDocument()
    const listItems = container.getElementsByTagName("li")
    expect(listItems.length).toBe(5)
  })
})
