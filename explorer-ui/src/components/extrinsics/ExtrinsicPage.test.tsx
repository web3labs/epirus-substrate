import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import ExtrinsicPage from "./ExtrinsicPage"
import { emptyMockPage, mockPageOf } from "../../_mocks/utils"
import { mockExtrinsicPageType } from "../../_mocks/data"

test("Extrinsic not found page", () => {
  const mockClient = createMockClient(emptyMockPage("extrinsics"))

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/extrinsic"]}>
        <ExtrinsicPage />
      </MemoryRouter>
    </Provider>
  )

  const title = screen.getByText(/not found/i)
  expect(title).toBeInTheDocument()
})

test("Extrinsic page", () => {
  const mockClient = createMockClient(
    mockPageOf(
      [mockExtrinsicPageType()],
      "extrinsics")
  )

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/extrinsic/0x96d57577102d2a6f1ea7ea041245d3f6adaaf67a698afe28cd5574b0cc3882a8"]}>
        <Routes>
          <Route path="extrinsic/:id/*" element={<ExtrinsicPage/>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const details = screen.findByText("Extrinsic Id")
  expect(details).toBeDefined()
})
