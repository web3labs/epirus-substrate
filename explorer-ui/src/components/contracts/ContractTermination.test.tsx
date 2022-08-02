import React from "react"
import { render, screen } from "@testing-library/react"
import { ContractTermination } from "./ContractTermination"
import { mockAccount, mockExtrinsic } from "../../_mocks/data"
import { MemoryRouter } from "react-router-dom"

test("Contract termination details", () => {
  render(
    <MemoryRouter initialEntries={["/contracts"]}>
      <ContractTermination
        extrinsic={mockExtrinsic}
        beneficiary={mockAccount()}
      />
    </MemoryRouter>
  )

  const details = screen.findByText("Termination Details")
  expect(details).toBeDefined()
})
