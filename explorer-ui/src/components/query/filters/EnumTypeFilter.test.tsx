import React from "react"
import { fireEvent, render } from "@testing-library/react"
import EnumTypeFilter, { enumTypeFilterOf } from "./EnumTypeFilter"

const inputValues = [
  { label: "one", value: "one" },
  { label: "two", value: "two" }
]

describe("EnumTypeFilter component", () => {
  it("should create from factory function", () => {
    const Filter = enumTypeFilterOf({
      label: "select",
      selector: "x",
      template: () => {},
      inputValues
    })
    const { container } = render(
      <Filter
        filterQuery={{}}
        setFilterQuery={jest.fn()}
      />
    )
    expect(container).toBeDefined()
  })

  it("should allow to select an option", () => {
    const mockSetFilter = jest.fn()

    const { container } = render(
      <EnumTypeFilter
        label="select"
        selector="x"
        filterQuery={{}}
        setFilterQuery={mockSetFilter}
        template={() => {}}
        inputValues={inputValues} />
    )

    const button = container.getElementsByTagName("button")[0]
    expect(button).toBeInTheDocument()

    expect(container.getElementsByTagName("li").length).toBe(0)

    fireEvent.click(button)

    expect(container.getElementsByTagName("li").length).toBe(2)

    fireEvent.click(container.getElementsByTagName("li")[1])

    expect(mockSetFilter).toBeCalled()
  })
})
