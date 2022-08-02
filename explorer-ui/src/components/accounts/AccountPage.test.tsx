import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import AccountPage from "./AccountPage"
import { emptyMockPage, mockPageOf } from "../../_mocks/utils"

describe("AccountPage component", () => {
  it("should display not found for a non-existent id", () => {
    const mockClient = createMockClient(emptyMockPage("accounts"))

    render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/accounts"]}>
          <AccountPage />
        </MemoryRouter>
      </Provider>
    )

    const title = screen.getByText(/not found/i)
    expect(title).toBeInTheDocument()
  })

  it("should render the account details for an existent id", () => {
    const mockClient = createMockClient(mockPageOf([
      {
        id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL",
        createdAt: new Date(),
        balance: {
          free: "0",
          reserved: "0"
        }
      }
    ], "accounts"))

    render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/accounts/5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL"]}>
          <Routes>
            <Route path="accounts/:id/*" element={<AccountPage/>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    )

    const idIcon = document.getElementById(
      "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL"
    )
    expect(idIcon).toBeInTheDocument()
  })
})
