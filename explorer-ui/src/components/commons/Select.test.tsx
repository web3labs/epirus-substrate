import React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import Select from "./Select"
import { setScreenWidth } from "../../_mocks/media"

describe("Select component", () => {
  it("should allow to select an option", () => {
    setScreenWidth()

    const onChange = jest.fn()
    const options = [
      { name: "one", value: "one" },
      { name: "two", value: "two" },
      { name: "etc", value: "etc" }
    ]
    const {
      container
    } = render(
      <Select
        options={options}
        onChange={onChange}
        selected={options[0]}
      />
    )

    const button = screen.getByRole("button", { name: "one" })
    expect(button).toBeInTheDocument()
    expect(container.getElementsByClassName("select-option").length).toBe(0)

    fireEvent.click(button)

    const opts = container.getElementsByClassName("select-option")
    expect(opts.length).toBe(3)

    fireEvent.click(opts[1])

    expect(onChange).toBeCalled()
  })
})
