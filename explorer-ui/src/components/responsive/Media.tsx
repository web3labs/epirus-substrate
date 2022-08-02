import { ReactElement } from "react"
import { useMediaQuery } from "react-responsive"

interface Props {
  children: ReactElement
}

export function Desktop ({ children }: Props) {
  const isDesktop = useMediaQuery({ minWidth: 992 })
  return isDesktop ? children : null
}
export function Tablet ({ children }: Props) {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 })
  return isTablet ? children : null
}
export function Mobile ({ children }: Props) {
  const isMobile = useMediaQuery({ maxWidth: 767 })
  return isMobile ? children : null
}
export function Default ({ children }: Props) {
  const isNotMobile = useMediaQuery({ minWidth: 768 })
  return isNotMobile ? children : null
}
