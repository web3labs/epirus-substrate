import React from "react"
import { render } from "@testing-library/react"
import Chip from "./Chip"

test("Chip", () => {
  const { container } = render(
    <Chip label="hello" />
  )

  const chip = container.childNodes[0]
  expect(chip.textContent).toBe("hello")
})
