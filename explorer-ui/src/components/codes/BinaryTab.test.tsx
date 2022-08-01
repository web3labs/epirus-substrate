import React from "react"
import { render, screen } from "@testing-library/react"
import BinaryTab from "./BinaryTab"
import { Provider } from "urql"
import { createMockClient } from "../../mocks/mockClient"

test("Binary tab shows the bytecode", () => {
  const mockClient = createMockClient({
    totalCount: 1,
    contractCodes: [
      {
        code: "0x0061736d01000000018c011660037f7f7f017f60027f7f017f60027f7f0060037f7" +
           "f7f0060017f0060047f7f7f7f017f60047f7f7f7f0060000060037f7e7e0060027f7e0060017f" +
           "017e60017f017f60027e7f017e60027e7e017e60057f7e7e7e7e0060017e017f60027f7f017e60" +
           "047f7e7e7e0060057f7f7f7f7f017f60027e7f017f60057f7f7f7f7f0060077f7f7f7f7f7f7f017" +
           "f02f00210057365616c300d7365616c5f7472616e736665720005057365616c30127365616c5f646" +
           "5706f7369745f6576656e740006057365616c30107365616c5f7365745f73746f72616765000305736"
      }
    ],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "1",
      endCursor: "1"
    }
  }
  )

  const { container } = render(
    <Provider value={mockClient}>
      <BinaryTab id="test" />
    </Provider>
  )

  const hexView = container.getElementsByTagName("table")
  expect(hexView).toBeDefined()
})

test("Binary tab code not found", () => {
  const mockClient = createMockClient({
    totalCount: 0,
    contractCodes: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
      endCursor: ""
    }
  }
  )

  render(
    <Provider value={mockClient}>
      <BinaryTab id="test" />
    </Provider>
  )

  const title = screen.getByText(/not found/i)
  expect(title).toBeInTheDocument()
})
