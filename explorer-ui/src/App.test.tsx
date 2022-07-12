import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"

test("blockchain link should be in the home page", () => {
  render(<App />)
  const linkElement = screen.getByText(/Blockchain/i)
  expect(linkElement).toBeInTheDocument()
})
