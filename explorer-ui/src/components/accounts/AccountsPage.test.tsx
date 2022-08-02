import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import AccountsPage from "./AccountsPage"
import { mockPageOf } from "../../_mocks/utils"
import { mockAccountEdges } from "../../_mocks/data"

describe("AccountsPage component", () => {
  it("should display a list of accounts", () => {
    const mockClient = createMockClient({
      accountsConnection: mockPageOf(mockAccountEdges)
    })

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
})
