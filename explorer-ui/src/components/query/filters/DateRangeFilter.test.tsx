import React from "react"
import { render } from "@testing-library/react"
import DateRangeFilter from "./DateRangeFilter"

test("Date range filter", () => {
  const { container } = render(
    <DateRangeFilter filterQuery={{}}
      setFilterQuery={() => {}}
    />
  )

  const chip = container.childNodes[0]
  expect(chip.textContent).toBe("Date Range")
})
