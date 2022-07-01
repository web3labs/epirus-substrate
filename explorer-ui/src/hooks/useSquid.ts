import { useEffect } from "react"
import toast from "react-hot-toast"
import { useQuery, UseQueryState } from "urql"
import { WarningToast } from "../components/Toast"
import { PageQuery } from "../types/pagination"

interface Props {
  query: string
  variables: PageQuery | object
  refresh?: {
    millis: number,
    disabled: boolean
  }
}

export default function useSquid ({
  query, variables, refresh = {
    millis: 1000,
    disabled: false
  }
}: Props) : [UseQueryState, () => void] {
  // Default request policy is "Cache-first"
  // Doesn't seem to be problematic but maybe it's better to always use "cache-and-network"?
  const [result, reexecuteQuery] = useQuery({
    query,
    variables
  })

  // With cache-and-network policy, urql will fetch the cached result first
  // If network was up and is now down, cached result will return [error=undefined, data={...}]
  // If network was down and now up, cached result will return [error=Error, data=undefined]
  // It will then try network request [fetching=false, stale=true, error=cached, data=cached]
  // If network is down, it then returns the error [fetching=false, stale=false, error=Error, data=undefined]
  // We should check both error and stale to make sure we are not adding or removing "cached" errors
  const { error, stale } = result
  useEffect(() => {
    if (!stale && error) {
      toast(WarningToast({ title: "Network Error", message: "There is some trouble fetching new data. Retrying..." }), { id: "squid-network-error" })
    }
  }, [error, stale])

  useEffect(() => {
    if (refresh.disabled || result.fetching) return

    // Refresh every refresh.millis...
    const timerId = setInterval(() => {
      reexecuteQuery({ requestPolicy: "cache-and-network" })
    }, refresh.millis)

    return () => clearTimeout(timerId)
  }, [result.fetching, reexecuteQuery])

  return [result, reexecuteQuery]
}
