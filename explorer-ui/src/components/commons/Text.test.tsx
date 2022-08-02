import React from "react"
import { render } from "@testing-library/react"
import { HexText } from "./Text"
import { setScreenWidth } from "../../_mocks/media"

afterAll(() => {
  jest.clearAllMocks()
})

test("HexText displays the short content", () => {
  setScreenWidth()

  const {
    container
  } = render(
    <HexText short={true}>
      0xfdcc156625126c96aa0d661d54d57e77b1037d05ed9dcd54eea5cdd6511c71f9
    </HexText>
  )

  expect(container.childNodes[0].textContent).toBe("0xfdcc15…1c71f9")
})
