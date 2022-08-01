import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import AccountPage from "./AccountPage"
import mock from "../../_mocks/accountsMockData"

test("Account not found page", () => {
  const mockClient = createMockClient(mock.empty)

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

test("Account page", () => {
  const mockClient = createMockClient(mock.single)

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
