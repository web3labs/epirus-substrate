import React from "react"
import { render, screen } from "@testing-library/react"
import App from "./App"

test("renders learn blockchain nav entry", () => {
  render(<App />)
  const linkElement = screen.getByText(/Blockchain/i)
  expect(linkElement).toBeInTheDocument()
})
