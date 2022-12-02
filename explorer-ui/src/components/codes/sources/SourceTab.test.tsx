import React from "react"
import { act, findByTestId, fireEvent, getByTestId, render } from "@testing-library/react"
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
      url: "dir0",
      name: "dir0",
      size: 0,
      utf8: false,
      ents: []
    },
    {
      type: "dir",
      url: "dir1",
      name: "dir1",
      size: 0,
      utf8: false,
      ents: [{
        type: "dir",
        url: "dir1/dir2",
        name: "dir12",
        size: 0,
        utf8: false
      }]
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

    // Browse a dir...
    const navFiles = await getByTestId(container, "folders")
    const dirs = navFiles.querySelectorAll("div div")
    await act(async () => {
      fireEvent.click(dirs[1])
    })
    await act(async () => {
      fireEvent.click(dirs[0])
    })
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

    const { container } = await act(async () => render(
      <SourceTab id="test" />
    ))

    const expandDiv = await findByTestId(container, "expand-sourcecode")
    fireEvent.click(expandDiv.children[0])

    await act(async () => {
      const reupBtn = await findByTestId(container, "btn-reup")
      fireEvent.click(reupBtn)
    })
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

  it("should display the error view with message", async () => {
    mockInfoApi.mockReturnValue({
      message: "Error"
    })

    await act(async () => render(
      <SourceTab id="test" />
    ))
  })

  it("should default to error view on exception", async () => {
    mockInfoApi.mockImplementation(() => {
      throw new Error("Error")
    })

    await act(async () => render(
      <SourceTab id="test" />
    ))
  })
})
