import React from "react"
import { act, fireEvent, render } from "@testing-library/react"
import SourceTab from "./SourceTab"
import { mockMetadata, MockWebSocket, mockSourceCode } from "../../../_mocks/verifierApiData"

const mockInfoApi = jest.fn()

jest.mock("../../../apis/verifierApi", () => {
  return {
    info: () => mockInfoApi(),
    metadata: () => Promise.resolve(mockMetadata),
    // TODO test data for more cases: no source, no utf8, subdir click
    directoryList: () => Promise.resolve([{
      type: "file",
      url: "lib.rs",
      name: "lib.rs",
      size: 1000,
      utf8: true
    },
    {
      type: "dir",
      url: "dir1",
      name: "dir1",
      size: 0,
      utf8: false,
      ents: {
        type: "dir",
        url: "dir1/dir2",
        name: "dir2",
        size: 0,
        utf8: false
      }
    }
    ]),
    resource: () => ({
      ok: () => true,
      text: () => Promise.resolve(mockSourceCode)
    }),
    errorLogDownloadLink: () => "somewhere/log",
    tailWebsocket: () => new MockWebSocket()
  }
})

beforeEach(() => {
  mockInfoApi.mockClear()
})

describe("SourceTab component", () => {
  it("should display the unverified view", async () => {
    mockInfoApi.mockReturnValue({
      status: "unverified",
      timestamp: new Date()
    })

    const { container } = await act(async () => render(
      <SourceTab id="test" />
    ))
    expect(
      container.querySelector("#tab-verification-opts")
    ).toBeDefined()

    const signTab = container.querySelector("#tab-owner-signed a")
    fireEvent.click(signTab!)

    const packageTab = container.querySelector("#tab-verifiable-package a")
    fireEvent.click(packageTab!)
  })

  it("should display the verified view", async () => {
    mockInfoApi.mockReturnValue({
      status: "verified",
      timestamp: new Date()
    })

    const { container } = await act(async () => render(
      <SourceTab id="test" />
    ))
    expect(
      container.querySelector("#metadata-view")
    ).toBeDefined()
  })

  it("should display the processing view", async () => {
    mockInfoApi.mockReturnValue({
      status: "processing",
      timestamp: new Date()
    })

    await act(async () => render(
      <SourceTab id="test" />
    ))
  })

  it("should display the metadata view", async () => {
    mockInfoApi.mockReturnValue({
      status: "metadata",
      timestamp: new Date()
    })

    await act(async () => render(
      <SourceTab id="test" />
    ))
  })

  it("should display the error view", async () => {
    mockInfoApi.mockReturnValue({
      status: "error",
      timestamp: new Date()
    })

    await act(async () => render(
      <SourceTab id="test" />
    ))
  })
})
