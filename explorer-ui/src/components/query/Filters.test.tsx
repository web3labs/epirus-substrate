import React from "react"
import { render } from "@testing-library/react"
import Filters from "./Filters"
import { textFilterOf } from "./filters/TextFilter"

test("Filters component should render", () => {
  const mockSetQuery = jest.fn()

  const { container } = render(
    <Filters
      filterTypes={[
        textFilterOf({
          label: "initial",
          selector: "x",
          template: jest.fn()
        })
      ]}
      pageQuery={{
        first: 10,
        where: {}
      }}
      setQuery={mockSetQuery}
    />
  )

  console.log(container.innerHTML)
})
