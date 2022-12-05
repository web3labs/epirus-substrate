import React from "react"
import { screen, fireEvent, getByTestId, render } from "@testing-library/react"
import SearchBox from "./SearchBox"
import { MemoryRouter } from "react-router-dom"
import { createMockClient } from "../../../_mocks/mockClient"
import { Provider } from "urql"
import { act } from "react-dom/test-utils"

jest.useFakeTimers()

describe("SearchBox component", () => {
  it("should display a search form", () => {
    const mockClient = createMockClient({})

    const { container } = render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/"]}>
          <SearchBox />
        </MemoryRouter>
      </Provider>
    )

    expect(container.getElementsByTagName("form").length).toBe(1)
  })

  it("should not trigger searching for less than N chars", () => {
    const mockClient = createMockClient({})
    const execQuery = jest.spyOn(mockClient, "executeQuery")
    const keyStrokes = "0x0"

    const { container } = render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/"]}>
          <SearchBox />
        </MemoryRouter>
      </Provider>
    )

    const searchInput = getByTestId(container, "input-search")
    act(() => {
      fireEvent.change(searchInput, {
        target: {
          value: keyStrokes
        }
      })
      jest.runAllTimers()
    })

    expect(execQuery).not.toHaveBeenCalled()
  })

  it("should trigger searching for more than N chars", async () => {
    const mockClient = createMockClient({})
    const execQuery = jest.spyOn(mockClient, "executeQuery")
    const keyStrokes = "abracadabra"

    const { container } = render(
      <Provider value={mockClient}>
        <MemoryRouter initialEntries={["/"]}>
          <SearchBox />
        </MemoryRouter>
      </Provider>
    )

    const searchInput = getByTestId(container, "input-search")
    act(() => {
      fireEvent.change(searchInput, {
        target: {
          value: keyStrokes
        }
      })
      jest.runAllTimers()
    })

    expect(execQuery).toHaveBeenCalled()

    const results = getByTestId(container, "div-results")
    expect(results).toBeDefined()
    expect(results.textContent).toEqual("No results for your query")

    act(() => {
      fireEvent.keyDown(searchInput, {
        key: "ArrowUp"
      })
      fireEvent.keyDown(searchInput, {
        key: "ArrowDown"
      })
      fireEvent.keyDown(searchInput, {
        key: "Escape"
      })
    })

    expect(screen.queryByText("No results for your query"))
      .toBeNull()
  })
})
