import React from "react"
import { fireEvent, render } from "@testing-library/react"
import { SuccessToast, warn, WarningToast } from "./Toast"
import { act } from "react-dom/test-utils"
import toast from "react-hot-toast"

test("Custom toast invocation", () => {
  const mockCustom = jest.fn()
  jest.spyOn(toast, "custom")
    .mockImplementation(mockCustom)

  act(() => {
    warn({
      id: "1",
      title: "title",
      message: "message"
    })
  })

  expect(mockCustom).toBeCalled()
})

test("Display warning toast", () => {
  const { container } = render(
    <WarningToast title="WARN" message="warning" />
  )

  expect(container.childNodes[0].textContent).toBe("WARNwarning")
})

test("Display and close success toast", async () => {
  const onClose = jest.fn()

  const { container } = render(
    <SuccessToast message="ok" onCloseHandler={onClose} />
  )

  const close = container.getElementsByTagName("button")[0]
  fireEvent.click(close)

  expect(onClose).toBeCalled()
})
