import React from "react"
import { render } from "@testing-library/react"
import { MemoryRouter } from 'react-router-dom'
import AccountLink from "./AccountLink"

test("Account link contains a link", () => {
  const {
    container
  } = render(
    <MemoryRouter initialEntries={["/accounts"]}>
      <AccountLink
        account={{ id: "5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL"}}
      />
   </MemoryRouter>)
  const link = container.getElementsByTagName("a")

  expect(link.length).toBe(1)
  expect(link[0].href).toBe("http://localhost/accounts/5HdKDnfR2X8y4fkgQUxXJuBxu638PuKQGUy5G16cyTjT5RzL")
})