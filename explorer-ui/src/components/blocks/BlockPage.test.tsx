import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import BlockPage from "./BlockPage"
import { emptyMockPage, mockPageOf } from "../../_mocks/utils"
import { mockBlock } from "../../_mocks/data"

test("Block not found page", () => {
  const mockClient = createMockClient(emptyMockPage("blocks"))

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/blocks/0x123"]}>
        <BlockPage />
      </MemoryRouter>
    </Provider>
  )

  const title = screen.getByText(/not found/i)
  expect(title).toBeInTheDocument()
})

test("Block page", () => {
  const mockClient = createMockClient(
    mockPageOf(
      [mockBlock(1)],
      "blocks")
  )

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/blocks/0x96d57577102d2a6f1ea7ea041245d3f6adaaf67a698afe28cd5574b0cc3882a8"]}>
        <Routes>
          <Route path="blocks/:hash/*" element={<BlockPage/>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const details = screen.findByText("Block Id")
  expect(details).toBeDefined()
})
