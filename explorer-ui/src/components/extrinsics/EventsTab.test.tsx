import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import EventsTab from "./EventsTab"
import { emptyMockPage, mockPageOf, randomId } from "../../_mocks/utils"
import { mockBlockEventEdges } from "../../_mocks/data"

test("Events empty tab", () => {
  const mockClient = createMockClient({
    eventsConnection: emptyMockPage()
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/blocks/0x123"]}>
        <Routes>
          <Route path="blocks/0x123" element={<EventsTab
            currentId={randomId()}
            where={randomId()}
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
    eventsConnection: mockPageOf(mockBlockEventEdges)
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/blocks/0x123"]}>
        <Routes>
          <Route path="/blocks/0x123" element={<EventsTab
            currentId={randomId()}
            where={{}}
          />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBeGreaterThanOrEqual(5)
})
