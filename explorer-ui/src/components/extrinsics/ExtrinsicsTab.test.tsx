import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import ExtrinsicsTab from "./ExtrinsicsTab"
import { emptyMockPage, mockPageOf, randomId } from "../../_mocks/utils"
import { mockLightExtrinsicEdges } from "../../_mocks/data"

test("Extrinsics empty tab", () => {
  const mockClient = createMockClient({
    extrinsicsConnection: emptyMockPage()
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/blocks"]}>
        <Routes>
          <Route path="blocks" element={<ExtrinsicsTab
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

test("Extrinsics tab", () => {
  const mockClient = createMockClient({
    extrinsicsConnection: mockPageOf(mockLightExtrinsicEdges)
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/blocks"]}>
        <Routes>
          <Route path="blocks" element={<ExtrinsicsTab
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
