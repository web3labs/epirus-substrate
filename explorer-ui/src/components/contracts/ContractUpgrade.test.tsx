import React from "react"
import { fireEvent, getByRole, render } from "@testing-library/react"
import ContractUpgrade from "./ContractUpgrade"
import { mockExtrinsic } from "../../_mocks/data"
import { buildArrayOf, randomCodeHash } from "../../_mocks/utils"
import { CodeHashChange } from "../../types/contracts"
import { MemoryRouter } from "react-router-dom"

test("Contract upgrade details", async () => {
  const changes = buildArrayOf(5, (i) => (
    {
      id: `change-${i}`,
      changedAt: new Date(),
      newCodeHash: randomCodeHash(),
      oldCodeHash: randomCodeHash(),
      extrinsic: mockExtrinsic
    }
  )) as CodeHashChange[]
  const { container } = render(
    <MemoryRouter initialEntries={["/contracts"]}>
      <ContractUpgrade codeHashChanges={changes} isOpen={false} />
    </MemoryRouter>
  )

  expect(container.getElementsByTagName("dl").length).toBe(0)

  fireEvent.click(getByRole(container, "switch"))

  expect(container.getElementsByTagName("dl").length).toBe(5)
})
