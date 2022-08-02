import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import ContractsPage from "./ContractsPage"
import { mockPageOf } from "../../_mocks/utils"
import { mockContractEdges } from "../../_mocks/data"

test("Contracts page", () => {
  const mockClient = createMockClient({
    contractsConnection: mockPageOf(mockContractEdges)
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/contracts"]}>
        <Routes>
          <Route path="contracts" element={<ContractsPage/>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBeGreaterThanOrEqual(5)
})
