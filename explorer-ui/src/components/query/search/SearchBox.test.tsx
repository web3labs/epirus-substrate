import React from "react"
import { render } from "@testing-library/react"
import SearchBox from "./SearchBox"
import { MemoryRouter } from "react-router-dom"
import { createMockClient } from "../../../_mocks/mockClient"
import { Provider } from "urql"

describe("SearchBox component", () => {
  it("should display a search form", () => {
    const mockClient = createMockClient({})

    const { container } = render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/"]}>
          <SearchBox />
        </MemoryRouter>
      </Provider>
    )

    expect(container.getElementsByTagName("form").length).toBe(1)
  })
})
