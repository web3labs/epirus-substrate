import React from "react"
import { findByTestId, findByText, fireEvent, render } from "@testing-library/react"
import DataView from "./DataView"
import { MemoryRouter } from "react-router-dom"

const RAW_DATA = "0x0b396f18d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe2200009573c24800000000000000000000"
const DECODED_DATA = {
  id: "0000000012-000001-9dabf-CONTRACTCALL",
  name: "transfer_from",
  args: [
    {
      id: "0000000012-000001-9dabf-CONTRACTCALL-from",
      name: "from",
      type: "AccountId",
      value: "0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
      displayName: undefined
    },
    {
      id: "0000000012-000001-9dabf-CONTRACTCALL-to",
      name: "to",
      type: "AccountId",
      value: "0x90b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe22",
      displayName: undefined
    },
    {
      id: "0000000012-000001-9dabf-CONTRACTCALL-value",
      name: "value",
      type: "Balance",
      value: "80000000000000",
      displayName: undefined
    }
  ]
}

test("DataView with decoded data details", async () => {
  const { container } = render(
    <MemoryRouter initialEntries={["/activities"]}>
      <DataView
        rawData={RAW_DATA}
        decodedData={DECODED_DATA}
      />
    </MemoryRouter>
  )

  expect(container.getElementsByTagName("table").length).toBe(2)
  expect(await findByText(container, "transfer_from")).toBeDefined()
  expect(await findByText(container, "from")).toBeDefined()
  expect(await findByText(container, "to")).toBeDefined()
  expect(await findByText(container, "value")).toBeDefined()

  const btnRaw = await findByTestId(container, "btn-raw")
  fireEvent.click(btnRaw)
  expect(container.getElementsByTagName("table").length).toBe(0)
  expect(await findByText(container, RAW_DATA)).toBeDefined()
})

test("DataView with raw data details", async () => {
  const { container } = render(
    <DataView
      rawData={RAW_DATA}
      decodedData={undefined}
    />
  )

  expect(container.getElementsByTagName("table").length).toBe(0)
  expect(await findByText(container, RAW_DATA)).toBeDefined()
})

test("DataView with no data", async () => {
  const { container } = render(
    <DataView
      rawData={undefined}
      decodedData={undefined}
    />
  )

  expect(container).toBeEmptyDOMElement()
})
