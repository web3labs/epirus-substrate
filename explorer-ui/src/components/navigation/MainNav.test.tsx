import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { Provider } from "urql"

import MainNav from "./MainNav"
import { createMockClient } from "../../_mocks/mockClient"
import { setScreenWidth } from "../../_mocks/media"

describe("MainNav component", () => {
  const mockClient = createMockClient({})

  it("should render a functional desktop navigation", () => {
    setScreenWidth()

    render(
      <Provider value={mockClient}>
        <MemoryRouter>
          <MainNav/>
        </MemoryRouter>
      </Provider>
    )

    const popBlockchain = screen.getByTestId("sn-Blockchain")
    fireEvent.click(popBlockchain)
    expect(screen.getByText("Accounts")).toBeDefined()

    const popContracts = screen.getByTestId("sn-Contracts")
    fireEvent.click(popContracts)
    expect(screen.getByText("Instances")).toBeDefined()
  })

  it("should render a functional mobile navigation", () => {
    setScreenWidth(412)

    render(
      <Provider value={mockClient}>
        <MemoryRouter>
          <MainNav/>
        </MemoryRouter>
      </Provider>
    )
    const menuBtn = screen.getByTestId("btn-mob-menu_open")

    fireEvent.click(menuBtn)

    const subContracts = screen.getByTestId("cni-Contracts")

    fireEvent.click(subContracts)

    screen.getByText("Instances")

    screen.getByTestId("btn-mob-menu_close")
  })
})
