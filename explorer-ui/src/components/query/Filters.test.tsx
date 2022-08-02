import React from "react"
import { fireEvent, getByText, render } from "@testing-library/react"
import Filters from "./Filters"
import { textFilterOf } from "./filters/TextFilter"
import { setScreenWidth } from "../../_mocks/media"

describe("Filters component", () => {
  it("should apply a basic filter", () => {
    setScreenWidth()
    const mockSetQuery = jest.fn()

    const { container } = render(
      <Filters
        filterTypes={[
          textFilterOf({
            selector: "id_eq",
            label: "Contract",
            template: value => (
              { id_eq: value }
            ),
            placeholder: "Address..."
          })
        ]}
        pageQuery={{
          first: 10,
          where: {
            name: {
              id_eq: "0x01"
            }
          }
        }}
        setQuery={mockSetQuery}
      />
    )

    const button = container.getElementsByTagName("button")[0]
    expect(button).toBeInTheDocument()
    expect(container.getElementsByTagName("input").length).toBe(0)

    fireEvent.click(button)

    const input = container.getElementsByTagName("input")[0]
    expect(input).toBeInTheDocument()

    fireEvent.change(input, {
      target: { value: "0xfdcc156625126c96aa0d661d54d57e77b1037d05ed9dcd54eea5cdd6511c71f9" }
    })

    fireEvent.click(getByText(container, "Apply Filters"))

    expect(mockSetQuery).toBeCalled()
  })
})
