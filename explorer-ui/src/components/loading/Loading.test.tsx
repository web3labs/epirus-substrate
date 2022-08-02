import React from "react"
import { act, render } from "@testing-library/react"
import { InputLoading, PageLoading } from "./Loading"

test("Input loader", () => {
  jest.useFakeTimers()

  const {
    container,
    unmount
  } = render(
    <InputLoading loading={true}>
      <span>content</span>
    </InputLoading>
  )
  act(() => {
    jest.runAllTimers()
  })

  expect(container.childNodes.length).toBe(1)

  unmount()
})

test("Page loader", () => {
  jest.useFakeTimers()

  const {
    container,
    unmount
  } = render(
    <PageLoading loading={true} />
  )
  act(() => {
    jest.runAllTimers()
  })

  expect(container.childNodes.length).toBe(1)

  unmount()
})
