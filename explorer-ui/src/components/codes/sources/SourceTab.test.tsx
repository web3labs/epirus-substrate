import React from "react"
import { act, findByTestId, findByText, fireEvent, getAllByTestId, getByTestId, render } from "@testing-library/react"
import SourceTab from "./SourceTab"
import { mockMetadata, MockWebSocket, mockSourceCode, mockSourceList, mockLongSourceList } from "../../../_mocks/verifierApiData"

const mockInfoApi = jest.fn()
const mockDirectoryListApi = jest.fn()

jest.mock("../../../apis/verifierApi", () => {
  return {
    info: () => mockInfoApi(),
    metadata: () => Promise.resolve(mockMetadata),
    directoryList: () => mockDirectoryListApi(),
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
    mockDirectoryListApi.mockReturnValue(mockSourceList)

    const { container } = await act(async () => render(
      <SourceTab id="test" />
    ))

    expect(
      container.querySelector("#metadata-view")
    ).toBeDefined()

    const sourceCodeFiles = container.getElementsByTagName("code")
    console.log(sourceCodeFiles)
    expect(sourceCodeFiles.length).toBe(2)

    const emptyFiles = await getAllByTestId(container, "empty-file")
    expect(emptyFiles.length).toBe(2)

    const downloadFiles = await getAllByTestId(container, "download-file")
    expect(downloadFiles.length).toBe(2)

    // Browse a dir...
    const navFiles = await getByTestId(container, "folders")
    const dirs = navFiles.querySelectorAll("div div")
    await act(async () => {
      fireEvent.click(dirs[1])
    })
    await act(async () => {
      fireEvent.click(dirs[0])
    })
    expect(await findByText(container, "This folder does not contain any files.")).toBeDefined()
  })

  it("should display the verified view with collapsed file view for >10 files", async () => {
    mockInfoApi.mockReturnValue({
      status: "verified",
      timestamp: new Date()
    })
    mockDirectoryListApi.mockReturnValue(mockLongSourceList)

    const { container } = await act(async () => render(
      <SourceTab id="test" />
    ))

    const collapsedFileView = await getAllByTestId(container, "collapsed-file")
    expect(collapsedFileView.length).toBe(11)
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
