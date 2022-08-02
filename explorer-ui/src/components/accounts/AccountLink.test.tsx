import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import AccountLink from "./AccountLink"
import { randomAccountId } from "../../_mocks/utils"

describe("AccountLink component", () => {
  it("should render an account link", () => {
    const {
      container
    } = render(
      <MemoryRouter initialEntries={["/accounts"]}>
        <AccountLink
          account={{ id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL" }}
        />
      </MemoryRouter>)
    const link = container.getElementsByTagName("a")

    expect(link.length).toBe(1)
    expect(link[0].href).toBe("http://localhost/accounts/5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL")
  })

  it("should add a badge if it is a contract account", () => {
    const {
      container
    } = render(
      <MemoryRouter initialEntries={["/accounts"]}>
        <AccountLink
          account={{
            id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL",
            contract: {
              id: randomAccountId()
            }
          }}
        />
      </MemoryRouter>)

    expect(container.getElementsByTagName("a").length).toBe(1)
    expect(container.getElementsByTagName("svg").length).toBeGreaterThanOrEqual(1)
  })

  it("should not render a link if it is the current id", () => {
    const {
      container
    } = render(
      <MemoryRouter initialEntries={["/accounts"]}>
        <AccountLink
          account={{ id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL" }}
          currentId="5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL"
        />
      </MemoryRouter>)

    expect(container.getElementsByTagName("a").length).toBe(0)
  })

  it("should add a badge if it is a contract account without link", () => {
    const {
      container
    } = render(
      <MemoryRouter initialEntries={["/accounts"]}>
        <AccountLink
          account={{
            id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL",
            contract: {
              id: randomAccountId()
            }
          }}
          currentId="5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL"
        />
      </MemoryRouter>)

    expect(container.getElementsByTagName("a").length).toBe(0)
    expect(container.getElementsByTagName("svg").length).toBeGreaterThanOrEqual(1)
  })
})
