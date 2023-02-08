import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Provider } from "urql"
import ActivityList from "./ActivityList"
import { createMockClient } from "../../_mocks/mockClient"
import { emptyMockPage } from "../../_mocks/utils"

describe("Activity List component", () => {
  it("should render an empty list when there is no data to show", () => {
    const mockClient = createMockClient({
      activitiesConnection: emptyMockPage()
    })

    render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/activities"]}>
          <ActivityList
            key="0"
            title="Test List"
          />
        </MemoryRouter>
      </Provider>
    )

    const title = screen.getByText(/Test List/i)
    expect(title).toBeInTheDocument()
    const emptyList = screen.getByText(/No activities to show/i)
    expect(emptyList).toBeInTheDocument()
  })
})
