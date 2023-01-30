import React from "react"
import { act, fireEvent, getByTestId, render } from "@testing-library/react"
import UnverifiedView from "./UnverifiedView"
import { upload } from "@testing-library/user-event/dist/upload"

import verifierApi from "../../../apis/verifierApi"

jest.mock("../../../apis/verifierApi", () => ({
  uploadMetadata: () => Promise.resolve({
    ok: true
  }),
  verify: jest.fn()
}))

jest.useFakeTimers()

describe("UnverifiedView component", () => {
  it("should switch modes", async () => {
    const { container } = await act(async () => render(
      <UnverifiedView
        chain="local"
        codeHash="0x"
        dispatch={jest.fn()}
      />
    ))

    const signTab = getByTestId(container, "tab-sign")
    fireEvent.click(signTab)

    const packageTab = getByTestId(container, "tab-package")
    fireEvent.click(packageTab)
  })

  it("should submit a verifiable package", async () => {
    const mockVerify = jest.spyOn(verifierApi, "verify")
    mockVerify.mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve("{}")
      } as unknown as Response))

    const zipPackage = new File([new Blob([
      Buffer.from([0x1F, 0x8B, 0x08, 0xFF])
    ])], "package.zip", {
      type: "application/gzip"
    })

    const { container } = await act(async () => render(
      <UnverifiedView
        chain="local"
        codeHash="0x"
        dispatch={jest.fn()}
      />
    ))

    await act(async () => {
      const fileInput = getByTestId(container, "input-upload")
      upload(fileInput, zipPackage)
    })

    const submitBtn = getByTestId(container, "submit-upload")
    expect(submitBtn.getAttribute("disabled")).toBeFalsy()
    fireEvent.click(submitBtn)

    expect(mockVerify).toBeCalled()
  })

  it("should handle verifiable package errors", async () => {
    const mockVerify = jest.spyOn(verifierApi, "verify")
    mockVerify.mockReturnValue(
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve(JSON.stringify({
          message: "Error"
        }))
      } as unknown as Response))

    const zipPackage = new File([new Blob([
      Buffer.from([0x1F, 0x8B, 0x08, 0xFF])
    ])], "package.zip", {
      type: "application/gzip"
    })

    const { container } = await act(async () => render(
      <UnverifiedView
        chain="local"
        codeHash="0x"
        dispatch={jest.fn()}
      />
    ))

    await act(async () => {
      const fileInput = getByTestId(container, "input-upload")
      upload(fileInput, zipPackage)
    })

    const submitBtn = getByTestId(container, "submit-upload")
    expect(submitBtn.getAttribute("disabled")).toBeFalsy()
    fireEvent.click(submitBtn)

    expect(mockVerify).toBeCalled()
  })

  it("should submit signed metdata", async () => {
    const metaText : string = JSON.stringify({
      version: 1
    })
    const metadataJson = new File([new Blob([metaText
    ])], "metadata.json", {
      type: "application/json"
    })
    metadataJson.text = () => Promise.resolve(metaText)

    const { container } = await act(async () => render(
      <UnverifiedView
        chain="local"
        codeHash="0x"
        dispatch={jest.fn()}
      />
    ))

    const signTab = getByTestId(container, "tab-sign")
    fireEvent.click(signTab)

    await act(async () => {
      const fileInput = getByTestId(container, "input-upload")
      upload(fileInput, metadataJson)
    })

    const sigMsg = getByTestId(container, "sig-msg")
    expect(sigMsg.textContent).toBe(
      "2430f1a2ad2982d0067885488a4c89e21ad1d7c83b115ba8f1b20acc88dfaea8"
    )

    await act(async () => {
      const signature = container.querySelector("#sig")
      fireEvent.change(signature!, { target: { value: "0xbebe" } })

      const submitBtn = getByTestId(container, "submit-upload")
      fireEvent.click(submitBtn)
    })
  })
})
