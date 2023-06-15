import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"
import { setScreenWidth } from "./_mocks/media"

test("blocks link should be in the home page", () => {
  setScreenWidth()

  render(<App />)
  const linkElement = screen.getByText(/Blocks/i)
  expect(linkElement).toBeInTheDocument()
})
