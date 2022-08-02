import React from "react"
import { render } from "@testing-library/react"
import ContractRow from "./ContractRow"
import { mockExtrinsic } from "../../_mocks/data"
import { MemoryRouter } from "react-router-dom"
import { randomAccountId, randomCodeHash, randomId } from "../../_mocks/utils"

test("Contract row long", () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/contracts"]}>
      <ContractRow
        obj={{
          id: randomAccountId(),
          account: {
            id: randomAccountId()
          },
          contractCode: {
            id: randomCodeHash()
          },
          createdAt: new Date(),
          createdFrom: mockExtrinsic,
          trieId: randomId(),
          deployer: {
            id: randomAccountId()
          }
        }}
        short={false}
      />
    </MemoryRouter>
  )

  expect(container.getElementsByTagName("svg").length).toBe(3)
})
