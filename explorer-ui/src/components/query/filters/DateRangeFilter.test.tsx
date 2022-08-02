import React from "react"
import { render } from "@testing-library/react"
import DateRangeFilter from "./DateRangeFilter"

test("Date range filter", () => {
  const { container } = render(
    <DateRangeFilter filterQuery={{}}
      setFilterQuery={() => {}}
    />
  )

  // NOTE: the date range component is 3rd party and will
  // be likely replaced
  const chip = container.childNodes[0]
  expect(chip.textContent).toBe("Date Range")
})
