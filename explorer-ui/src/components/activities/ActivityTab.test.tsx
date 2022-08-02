import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import ActivityTab from "./ActivityTab"
import { mockPageOf } from "../../_mocks/utils"
import { mockActivityEdges } from "../../_mocks/data"

describe("ActivitiesTab component", () => {
  it("should render a list of activities", () => {
    const mockClient = createMockClient({
      activitiesConnection: mockPageOf(mockActivityEdges)
    })

    const { container } = render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/activities"]}>
          <Routes>
            <Route path="activities" element={
              <ActivityTab where={
                {
                  from: {
                    id_eq: "0x01"
                  }
                }
              } />
            } />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    const listItems = container.getElementsByTagName("li")
    expect(listItems.length).toBeGreaterThanOrEqual(5)
  })
})
