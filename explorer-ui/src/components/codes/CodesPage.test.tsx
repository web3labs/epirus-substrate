import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router"
import { Provider } from "urql"
import { createMockClient } from "../../_mocks/mockClient"
import CodesPage from "./CodesPage"
import { mockPageOf } from "../../_mocks/utils"
import { mockContractCode } from "../../_mocks/data"

test("Contract codes page", () => {
  const mockClient = createMockClient({
    contractCodesConnection: mockPageOf([{
      node: mockContractCode()
    }])
  })

  const { container } = render(
    <Provider value={mockClient}>
      <MemoryRouter initialEntries={["/codes"]}>
        <Routes>
          <Route path="codes" element={<CodesPage/>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )

  const listItems = container.getElementsByTagName("li")
  expect(listItems.length).toBeGreaterThanOrEqual(5)
})
