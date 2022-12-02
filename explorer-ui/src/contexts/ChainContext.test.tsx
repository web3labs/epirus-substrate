import { act, render } from "@testing-library/react"
import React from "react"
import * as urql from "urql"
import ChainContextProvider, { useChainProperties } from "./ChainContext"

jest.mock("urql")

const TestContext = () => {
  const props = useChainProperties()
  return (
    <ChainContextProvider>
      {JSON.stringify(props)}
    </ChainContextProvider>
  )
}

describe("chain context", () => {
  it("should set the chain info", async () => {
    jest.spyOn(urql, "useClient").mockImplementation(() => ({
      query: () => ({
        toPromise: () => Promise.resolve({
          data: {
            chainProperties: [
              {
                name: "local contracts chain",
                version: 55,
                ss58Format: null,
                token: {
                  tokenDecimals: 18,
                  tokenSymbol: "TST"
                }
              }
            ]
          }
        })
      })
    } as unknown as urql.Client))

    await act(async () => render(
      <TestContext/>
    ))
  })

  it("should keep the default chain info on api errors", async () => {
    jest.spyOn(urql, "useClient").mockImplementation(() => ({
      query: () => ({
        toPromise: () => Promise.resolve({
          data: null,
          error: "error"
        })
      })
    } as unknown as urql.Client))

    await act(async () => render(
      <TestContext/>
    ))
  })

  it("should keep the default chain info on errors", async () => {
    jest.spyOn(urql, "useClient").mockImplementation(() => ({
      query: () => {
        throw new Error("Error")
      }
    } as unknown as urql.Client))

    await act(async () => render(
      <TestContext/>
    ))
  })
})
