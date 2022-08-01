import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import ActivitiesPage from "./ActivitiesPage"
import mock from "../../_mocks/activitiesMockData"

test("Activities page", () => {
  const mockClient = createMockClient(mock.connections)

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/activities"]}>
        <Routes>
          <Route path="activities" element={<ActivitiesPage/>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBeGreaterThanOrEqual(5)
})
