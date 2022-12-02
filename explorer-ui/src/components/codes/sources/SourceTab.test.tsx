import React from "react"
import { act, findByTestId, render } from "@testing-library/react"
import SourceTab from "./SourceTab"
import { mockMetadata, MockWebSocket, mockSourceCode } from "../../../_mocks/verifierApiData"

const mockInfoApi = jest.fn()

jest.mock("../../../apis/verifierApi", () => {
  return {
    info: () => mockInfoApi(),
    metadata: () => Promise.resolve(mockMetadata),
    directoryList: () => Promise.resolve([{
      type: "file",
      url: "lib.rs",
      name: "lib.rs",
      size: 1000,
      utf8: true
    },
    {
      type: "file",
      url: "bin",
      name: "bin",
      size: 10,
      utf8: false
    },
    {
      type: "file",
      url: "empty",
      name: "empty",
      size: 0,
      utf8: true
    },
    {
      type: "file",
      url: "fail",
      name: "fail",
      size: 10,
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
    resource: ({ codeHash, path }:
      {codeHash: string, path: string}) => {
      if (path === "empty") {
        return {
          ok: true,
          text: () => Promise.resolve("")
        }
      }
      if (path === "fail") {
        return {
          ok: false,
          json: () => Promise.resolve(
            JSON.stringify({ message: "error message" })
          )
        }
      }
      return {
        ok: true,
        text: () => Promise.resolve(mockSourceCode)
      }
    },
    errorLogDownloadLink: () => "somewhere/log",
    resourceDownloadLink: ({ codeHash, path }:
      {codeHash: string, path: string}) => path,
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
      findByTestId(container, "opts-verification")
    ).toBeDefined()
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
