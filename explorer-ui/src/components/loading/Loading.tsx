import React, { ReactElement, useCallback, useEffect, useState } from "react"

function Loading ({
  delay = 200,
  loading,
  loader = <PuffLoading/>,
  fallback = null
}: {
  loading: boolean,
  delay?: number,
  loader?: ReactElement,
  fallback?: ReactElement | null
}) {
  const [delayed, setDelayed] = useState(false)
  const [timeOutId, setTimeOutId] = useState<any>()
  useEffect(() => {
    setTimeOutId(setTimeout(
      () => {
        if (loading) {
          setDelayed(true)
        }
      }, delay
    ))
    return () => {
      clearTimeout(timeOutId)
    }
  }, [])
  useCallback(() => {
    clearTimeout(timeOutId)
  }, [loading])

  return delayed ? loader : fallback
}

export function PageLoading ({ loading, delay }: { loading: boolean, delay?: number }) {
  return <div className="flex w-full h-32 items-center justify-center text-gray-500">
    <Loading
      loading={loading}
      delay={delay}
    />
  </div>
}

export function InputLoading (
  { loading, delay, children }:
  { loading: boolean, delay?: number, children: ReactElement }
) {
  return <div className="flex absolute items-center inset-y-0 right-1 text-gray-500">
    <Loading
      loading={loading}
      delay={delay}
      fallback={children}
      loader={<DotsLoading/>}
    />
  </div>
}

function DotsLoading () {
  return (
    <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg"
      width="32px"
      height="32px"
      x="0px" y="0px"
      viewBox="0 0 100 100" enableBackground="new 0 0 0 0" xmlSpace="preserve">
      <circle fill="currentColor" stroke="none" cx="6" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.1"/>
      </circle>
      <circle fill="currentColor" stroke="none" cx="26" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.2"/>
      </circle>
      <circle fill="currentColor" stroke="none" cx="46" cy="50" r="6">
        <animate
          attributeName="opacity"
          dur="1s"
          values="0;1;0"
          repeatCount="indefinite"
          begin="0.3"/>
      </circle>
    </svg>
  )
}

function PuffLoading () {
  /* -- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -- */
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
      <g fill="none" fillRule="evenodd" strokeWidth="2">
        <circle cx="22" cy="22" r="1">
          <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
        </circle>
        <circle cx="22" cy="22" r="1">
          <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"/>
          <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"/>
        </circle>
      </g>
    </svg>
  )
}
