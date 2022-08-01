import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../mocks/mockClient"
import ActivityTab from "./ActivityTab"
import mock from "../../mocks/activitiesMockData"

test("Activities tab", () => {
  const mockClient = createMockClient(mock.connections)

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/activities"]}>
        <Routes>
          <Route path="activities" element={
            <ActivityTab where="" />
          } />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBeGreaterThanOrEqual(5)
})
