import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import CodePage from "./CodePage"
import { emptyMockPage, mockPageOf } from "../../_mocks/utils"
import { mockContractCode } from "../../_mocks/data"

test("Contract code not found page", () => {
  const mockClient = createMockClient(emptyMockPage("contractCodes"))

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/codes"]}>
        <CodePage />
      </MemoryRouter>
    </Provider>
  )

  const title = screen.getByText(/not found/i)
  expect(title).toBeInTheDocument()
})

test("Contract code page", () => {
  const mockClient = createMockClient(
    mockPageOf(
      [mockContractCode()],
      "contractCodes")
  )

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/codes/0x38ec0f8fde303c179bcabaa40e987d6da361c664438f866a9967e58f92c39b56"]}>
        <Routes>
          <Route path="codes/:id/*" element={<CodePage/>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const details = screen.findByText("Creation Details")
  expect(details).toBeDefined()
})
