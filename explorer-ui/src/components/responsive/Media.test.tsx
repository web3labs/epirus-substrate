import React from "react"
import { render } from "@testing-library/react"
import { Default, Desktop, Mobile, Tablet } from "./Media"
import { setScreenWidth } from "../../_mocks/media"

describe("Media queries", () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it("should render the default content", () => {
    setScreenWidth()
    const { container } = render(
      <>
        <Default>
          <span>Default content</span>
        </Default>
        <Mobile>
          <span>Mobile content</span>
        </Mobile>
      </>
    )
    expect(container.firstChild?.textContent).toBe("Default content")
  })

  it("should render the mobile content", () => {
    setScreenWidth(412)
    const { container } = render(
      <>
        <Default>
          <span>Default content</span>
        </Default>
        <Mobile>
          <span>Mobile content</span>
        </Mobile>
      </>
    )
    expect(container.firstChild?.textContent).toBe("Mobile content")
  })

  it("should render the tablet content", () => {
    setScreenWidth(768)
    const { container } = render(
      <>
        <Tablet>
          <span>Tablet content</span>
        </Tablet>
        <Mobile>
          <span>Mobile content</span>
        </Mobile>
        <Default>
          <span>Default content</span>
        </Default>
      </>
    )
    expect(container.firstChild?.textContent).toBe("Tablet content")
  })

  it("should render the tablet content", () => {
    setScreenWidth(992)
    const { container } = render(
      <>
        <Desktop>
          <span>Desktop content</span>
        </Desktop>
        <Tablet>
          <span>Tablet content</span>
        </Tablet>
        <Mobile>
          <span>Mobile content</span>
        </Mobile>
        <Default>
          <span>Default content</span>
        </Default>
      </>
    )
    expect(container.firstChild?.textContent).toBe("Desktop content")
  })
})
