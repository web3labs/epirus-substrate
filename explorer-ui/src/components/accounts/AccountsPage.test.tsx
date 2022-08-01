import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import AccountsPage from "./AccountsPage"
import mock from "../../_mocks/accountsMockData"

test("Accounts page", () => {
  const mockClient = createMockClient(mock.connections)

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/accounts"]}>
        <Routes>
          <Route path="accounts" element={<AccountsPage/>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBeGreaterThanOrEqual(5)
})
