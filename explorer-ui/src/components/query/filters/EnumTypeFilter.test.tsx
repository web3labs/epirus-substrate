import React from "react"
import { fireEvent, render } from "@testing-library/react"
import EnumTypeFilter from "./EnumTypeFilter"

test("Enum Type Filter", () => {
  const mockSetFilter = jest.fn()

  const { container } = render(
    <EnumTypeFilter
      label="select"
      selector="x"
      filterQuery={{}}
      setFilterQuery={mockSetFilter}
      template={() => {}}
      inputValues={[
        { label: "one", value: "one" },
        { label: "two", value: "two" }
      ]} />
  )

  const button = container.getElementsByTagName("button")[0]
  expect(button).toBeInTheDocument()

  expect(container.getElementsByTagName("li").length).toBe(0)

  fireEvent.click(button)

  expect(container.getElementsByTagName("li").length).toBe(2)

  fireEvent.click(container.getElementsByTagName("li")[1])

  expect(mockSetFilter).toBeCalled()
})
