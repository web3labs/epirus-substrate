import React from "react"
import { render, screen } from "@testing-library/react"
import ContractUpgrade from "./ContractUpgrade"
import { mockExtrinsic } from "../../_mocks/data"
import { buildArrayOf, randomCodeHash } from "../../_mocks/utils"
import { CodeHashChange } from "../../types/contracts"

test("Contract termination details", () => {
  const changes = buildArrayOf(5, (i) => (
    {
      id: `change-${i}`,
      changedAt: new Date(),
      newCodeHash: randomCodeHash(),
      oldCodeHash: randomCodeHash(),
      extrinsic: mockExtrinsic
    }
  )) as CodeHashChange[]
  render(
    <ContractUpgrade codeHashChanges={changes} />
  )

  const details = screen.findByText("Termination Details")
  expect(details).toBeDefined()
})
