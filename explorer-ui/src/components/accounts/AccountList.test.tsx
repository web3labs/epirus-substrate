import React from "react"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Provider } from "urql"
import AccountList from "./AccountList"
import { contractByDeployer } from "../contracts/ContractTab"
import { createMockClient } from "../../_mocks/mockClient"
import { emptyMockPage, mockPageOf } from "../../_mocks/utils"
import { mockAccountEdges } from "../../_mocks/data"

describe("AccountList component", () => {
  it("should render an empty list when there is no data to show", () => {
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

  it("should display the first page of a paginated response data", () => {
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
            short={false}
          />
        </MemoryRouter>
      </Provider>
    )

    const title = screen.getByText(/Test List/i)
    expect(title).toBeInTheDocument()
    const listItems = container.getElementsByTagName("li")
    expect(listItems.length).toBe(5)
  })
})
