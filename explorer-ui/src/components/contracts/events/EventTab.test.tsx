import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../../_mocks/mockClient"
import EventTab from "./EventTab"
import { emptyMockPage, mockPageOf, randomId } from "../../../_mocks/utils"
import { mockEventEdges } from "../../../_mocks/data"

test("Events empty tab", () => {
  const mockClient = createMockClient({
    contractEmittedEventsConnection: emptyMockPage()
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/contracts"]}>
        <Routes>
          <Route path="contracts" element={<EventTab
            id={randomId()}
          />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBe(0)
})

test("Events tab", () => {
  const mockClient = createMockClient({
    contractEmittedEventsConnection: mockPageOf(mockEventEdges)
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/contracts"]}>
        <Routes>
          <Route path="contracts" element={<EventTab
            id={randomId()}
          />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBeGreaterThanOrEqual(5)
})
