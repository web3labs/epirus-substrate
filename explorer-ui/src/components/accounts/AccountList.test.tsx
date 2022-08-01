import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Provider } from "urql"
import AccountList from "./AccountList"
import { contractByDeployer } from "../contracts/ContractTab"
import { createMockClient } from "../../_mocks/mockClient"
import { emptyMockPage, mockPageOf } from "../../_mocks/utils"
import { mockAccountEdges } from "../../_mocks/data"

test("Account list renders empty list", () => {
  const mockClient = createMockClient({
    accountsConnection: emptyMockPage()
  })

  render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/accounts"]}>
        <AccountList
          key="0"
          title="Test List"
        />
      </MemoryRouter>
    </Provider>
  )

  const title = screen.getByText(/Test List/i)
  expect(title).toBeInTheDocument()
  const emptyList = screen.getByText(/No accounts to show/i)
  expect(emptyList).toBeInTheDocument()
})

test("Account list renders the first page", () => {
  const mockClient = createMockClient({
    accountsConnection: mockPageOf(mockAccountEdges)
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/accounts"]}>
        <AccountList
          key="0"
          title="Test List"
          pageQuery={{
            first: 5,
            where: contractByDeployer(
              "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL"
            )
          }}
        />
      </MemoryRouter>
    </Provider>
  )

  const title = screen.getByText(/Test List/i)
  expect(title).toBeInTheDocument()
  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBe(5)
})
