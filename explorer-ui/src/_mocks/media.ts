import * as responsive from "react-responsive"

export function setScreenWidth (width = 1024) {
  jest
    .spyOn(responsive, "useMediaQuery")
    .mockImplementation((settings: responsive.MediaQueryAllQueryable) => {
      const { maxWidth, minWidth } = settings

      return (maxWidth === undefined || maxWidth >= width) &&
      (minWidth === undefined || minWidth <= width)
    })
}
