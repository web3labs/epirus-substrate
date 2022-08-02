import React from "react"
import { fireEvent, getByRole, render } from "@testing-library/react"
import { ContractTermination } from "./ContractTermination"
import { mockAccount, mockExtrinsic } from "../../_mocks/data"
import { MemoryRouter } from "react-router-dom"

test("Contract termination details", () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/contracts"]}>
      <ContractTermination
        extrinsic={mockExtrinsic}
        beneficiary={mockAccount()}
        isOpen={false}
      />
    </MemoryRouter>
  )

  expect(container.getElementsByTagName("dl").length).toBe(0)

  fireEvent.click(getByRole(container, "switch"))

  expect(container.getElementsByTagName("dl").length).toBe(1)
})
