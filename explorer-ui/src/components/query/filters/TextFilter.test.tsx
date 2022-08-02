import React from "react"
import { fireEvent, render } from "@testing-library/react"
import TextFilter, { textFilterOf } from "./TextFilter"

test("Text Filter", () => {
  const mockSetFilter = jest.fn()

  const { container } = render(
    <TextFilter
      label="initial"
      selector="x"
      filterQuery={{}}
      setFilterQuery={mockSetFilter}
      template={() => {}}
    />
  )

  const input = container.getElementsByTagName("input")[0]
  expect(input).toBeInTheDocument()

  fireEvent.change(input, {
    target: {
      value: "0xfdcc156625126c96aa0d661d54d57e77b1037d05ed9dcd54eea5cdd6511c71f9"
    }
  })

  fireEvent.change(input, {
    target: {
      value: ""
    }
  })

  expect(mockSetFilter).toBeCalledTimes(2)
})

test("Text Filter builder", () => {
  const mockSetFilter = jest.fn()

  const tf = textFilterOf({
    label: "initial",
    selector: "x",
    template: jest.fn()
  })

  const { container } = render(
    tf({
      filterQuery: { x: { data: { } } },
      setFilterQuery: mockSetFilter
    })
  )

  const input = container.getElementsByTagName("input")[0]
  expect(input).toBeInTheDocument()

  fireEvent.change(input, {
    target: {
      value: "0xfdcc156625126c96aa0d661d54d57e77b1037d05ed9dcd54eea5cdd6511c71f9"
    }
  })

  expect(mockSetFilter).toBeCalled()
})
