import React from "react"
import { render } from "@testing-library/react"
import EnumTypeFilter from "./EnumTypeFilter"

test("Enum Type Filter", () => {
  const { container } = render(
    <EnumTypeFilter
      label="initial"
      selector="x"
      filterQuery={{}}
      setFilterQuery={() => {}}
      template={() => {}}
      inputValues={[{
        label: "x",
        value: "x"
      }]} />
  )

  const chip = container.childNodes[0]
  expect(chip.textContent).toBe("initialx")
})
