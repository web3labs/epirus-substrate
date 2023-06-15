import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import { Provider } from "urql"

import SideBar from "./SideBar"
import { createMockClient } from "../../_mocks/mockClient"
import { setScreenWidth } from "../../_mocks/media"

describe("MainNav component", () => {
  const mockClient = createMockClient({})

  it("should render a functional desktop navigation", () => {
    setScreenWidth()

    render(
      <Provider value={mockClient}>
        <MemoryRouter>
          <SideBar highlight={0}/>
        </MemoryRouter>
      </Provider>
    )

    const popBlockchain = screen.getByTestId("Home")
    fireEvent.click(popBlockchain)
    expect(screen.getByText("Home")).toBeDefined()

    const popContracts = screen.getByTestId("Contracts")
    fireEvent.click(popContracts)
    expect(screen.getByText("Contracts")).toBeDefined()
  })

  /*
  it("should render a functional mobile navigation", () => {
    setScreenWidth(412)

    render(
      <Provider value={mockClient}>
        <MemoryRouter>
          <SideBar highlight={0}/>
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
  */
})
