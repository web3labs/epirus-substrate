import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"
import { setScreenWidth } from "./_mocks/media"

test("blockchain link should be in the home page", () => {
  setScreenWidth()

  render(<App />)
  const linkElement = screen.getByText(/Blockchain/i)
  expect(linkElement).toBeInTheDocument()
})
