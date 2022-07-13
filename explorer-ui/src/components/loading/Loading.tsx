import React, { ReactElement, useCallback, useEffect, useState } from "react"

export default function Loading ({
  delay = 200,
  loading,
  loader = <PuffLoading/>
}: {loading: boolean, delay?: number, loader?: ReactElement}) {
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

  return delayed ? loader : null
}

export function PageLoading ({ loading, delay }: { loading: boolean, delay?: number }) {
  return <div className="flex w-full h-32 items-center justify-center text-gray-500">
    <Loading
      loading={loading}
      delay={delay}
    />
  </div>
}

export function InputLoading ({ loading, delay }: { loading: boolean, delay?: number }) {
  return <div className="flex absolute items-center inset-y-0 right-0 pr-3 text-gray-500">
    <Loading
      loading={loading}
      delay={delay}
      loader={<DotsLoading/>}
    />
  </div>
}

export function DotsLoading () {
  /* -- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -- */
  return (
    <svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <circle cx="15" cy="15" r="15">
        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/>
        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/>
      </circle>
      <circle cx="60" cy="15" r="9" fillOpacity="0.3">
        <animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite"/>
        <animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite"/>
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite"/>
        <animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite"/>
      </circle>
    </svg>
  )
}

export function PuffLoading () {
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
