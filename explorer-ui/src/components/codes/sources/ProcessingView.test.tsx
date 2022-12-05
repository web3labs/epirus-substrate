import React from "react"
import { act, findByTestId, fireEvent, render } from "@testing-library/react"
import { MockWebSocket } from "../../../_mocks/verifierApiData"
import ProcessingView from "./ProcessingView"

const mockInfoApi = jest.fn()
const mockWs = new MockWebSocket()

jest.useFakeTimers()

jest.mock("../../../apis/verifierApi", () => {
  return {
    info: () => mockInfoApi(),
    tailWebsocket: () => mockWs
  }
})

beforeEach(() => {
  mockInfoApi.mockClear()
})

describe("ProcessingView component", () => {
  it("should render processing success", async () => {
    const mockDispatch = jest.fn()
    mockInfoApi.mockReturnValue({
      status: "processing",
      timestamp: new Date()
    })

    const { container } = await act(async () => render(
      <ProcessingView
        chain="local"
        codeHash="0x"
        key={"k"}
        dispatch={mockDispatch}
      />
    ))

    const taLogs = findByTestId(container, "ta-logs")
    expect(taLogs).toBeDefined()

    mockWs.send("message", {
      data: JSON.stringify({
        type: "LOG",
        data: "Hello"
      })
    })
    mockWs.send("message", {
      data: JSON.stringify({
        type: "EOT",
        data: true
      })
    })
    mockWs.send("close", 1000)

    const btnSuccess = await findByTestId(container, "btn-success")
    fireEvent.click(btnSuccess)

    expect(mockDispatch).toBeCalledWith({ type: "verificationSuccess" })
  })

  it("should render processing error", async () => {
    const mockDispatch = jest.fn()
    mockInfoApi.mockReturnValue({
      status: "processing",
      timestamp: new Date()
    })

    const { container } = await act(async () => render(
      <ProcessingView
        chain="local"
        codeHash="0x"
        key={"k"}
        dispatch={mockDispatch}
      />
    ))

    const taLogs = findByTestId(container, "ta-logs")
    expect(taLogs).toBeDefined()

    mockWs.send("message", {
      data: JSON.stringify({
        type: "LOG",
        data: "Hello"
      })
    })
    mockWs.send("message", {
      data: JSON.stringify({
        type: "EOT",
        data: false
      })
    })
    mockWs.send("close", 1000)

    const btnError = await findByTestId(container, "btn-error")
    fireEvent.click(btnError)

    expect(mockDispatch).toBeCalledWith({ type: "verificationError" })
  })
})
