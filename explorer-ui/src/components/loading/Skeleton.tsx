import React, { ReactElement } from "react"
import List, { Cols, Row } from "../List"

export function Heading () {
  return (
    <div className="mt-8 h-4 w-4/5"></div>
  )
}

export function Text () {
  return (
    <div className="my-4">
      <div className="h-3 my-3 w-4/6"></div>
      <div className="h-3 my-3 w-3/6"></div>
      <div className="h-3 my-3 w-2/6"></div>
    </div>
  )
}

export function RowSkeleton ({ size = 5 }: {size?: number}) {
  const skeletons : JSX.Element[] = []
  for (let i = 0; i < size; i++) {
    skeletons.push(
      <Row key={`arsk-${i}`}>
        <Cols>
          <div className="skeleton h-10 w-full"/>
        </Cols>
      </Row>
    )
  }
  return (<>
    {skeletons}
  </>)
}

export function ListSkeleton ({ title, description, size = 1 }
  : {title?: JSX.Element | string, description?: JSX.Element | string, size?: number}) {
  return (
    <Skeleton>
      <List title={title} description={description}>
        <RowSkeleton size={size}/>
      </List>
    </Skeleton>
  )
}

export default function Skeleton ({ children }: {children: JSX.Element | JSX.Element[]}) {
  return (
    <div className="animate-pulse w-full">
      {children}
    </div>
  )
}

export function onFetching (
  ltime: React.MutableRefObject<number>,
  skeleton: ReactElement,
  minMillis: number = 700
) {
  const now = new Date().getTime()
  const ellapsed = now - ltime.current
  ltime.current = now

  if (ellapsed > minMillis) {
    return skeleton
  } else {
    return null
  }
}
