import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import ContractPage from "./ContractPage"
import { emptyMockPage, mockPageOf } from "../../_mocks/utils"
import { mockContract } from "../../_mocks/data"

test("Contract not found page", () => {
  const mockClient = createMockClient(emptyMockPage("contracts"))

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/contracts"]}>
        <ContractPage />
      </MemoryRouter>
    </Provider>
  )

  const title = screen.getByText(/not found/i)
  expect(title).toBeInTheDocument()
})

test("Contract page", () => {
  const mockClient = createMockClient(
    mockPageOf(
      [mockContract()],
      "contracts")
  )

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/contracts/5Hh1Zsd5kJ1v9RdbKXQvVS93CmwErJPC86g4s7qzEJzvZLiE"]}>
        <Routes>
          <Route path="contracts/:id/*" element={<ContractPage/>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const details = screen.findByText("Creation Details")
  expect(details).toBeDefined()
})
