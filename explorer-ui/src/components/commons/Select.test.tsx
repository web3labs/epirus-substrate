import React from "react"
import { render, screen } from "@testing-library/react"
import Select from "./Select"

test("Select basic behavior", async () => {
  const onChange = jest.fn()
  const options = [
    { name: "one", value: "one" },
    { name: "two", value: "two" },
    { name: "etc", value: "etc" }
  ]
  render(
    <Select
      options={options}
      onChange={onChange}
      selected={options[0]}
    />
  )

  // NOTE that ListBox.Options are not being rendered when simulating
  // 'click' event and waiting for them (reason unknown)

  expect(screen.getByRole("button", { name: "one" })).toBeInTheDocument()
})
