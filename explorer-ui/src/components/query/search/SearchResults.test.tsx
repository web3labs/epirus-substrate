import React from "react"
import { render, screen } from "@testing-library/react"
import { SearchResultOption } from "./SearchResults"
import { randomAccountId, randomCodeHash } from "../../../_mocks/utils"

describe("SearchResults component", () => {
  it("should render all result types", () => {
    const acc1 = randomAccountId()
    const acc2 = randomAccountId()
    const cod = randomCodeHash()

    render(
      <>
        <SearchResultOption data={{
          id: acc1,
          contract: {
            id: randomAccountId()
          }
        }} type={"contracts"} />
        <SearchResultOption data={{
          id: cod
        }} type={"contractCodes"} />
        <SearchResultOption data={{
          id: acc2
        }} type={"accounts"} />
      </>
    )

    expect(screen.findByText(acc1)).toBeDefined()
    expect(screen.findByText(acc2)).toBeDefined()
    expect(screen.findByText(cod)).toBeDefined()
  })
})
