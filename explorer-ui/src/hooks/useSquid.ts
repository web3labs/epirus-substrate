import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { useQuery, UseQueryState } from "urql"
import { warn } from "../components/commons/Toast"
import { PageQuery } from "../types/pagination"

export interface SquidRefreshProps {
  millis: number
}

interface Props {
  query: string
  variables: PageQuery | object
  refresh?: SquidRefreshProps
  pause?: boolean
}

export default function useSquid ({
  query, variables, refresh, pause = false
}: Props) : [UseQueryState, () => void] {
  // Default request policy is "Cache-first"
  // Doesn't seem to be problematic but maybe it's better to always use "cache-and-network"?
  const [result, reexecuteQuery] = useQuery({
    query,
    variables,
    pause
  })
  // Used to store the error toast ID to later be removed.
  const [toastId, setToastId] = useState<string | undefined>(undefined)

  // With cache-and-network policy, urql will fetch the cached result first
  // If network was up and is now down, cached result will return [error=undefined, data={...}]
  // If network was down and now up, cached result will return [error=Error, data=undefined]
  // It will then try network request [fetching=false, stale=true, error=cached, data=cached]
  // If network is down, it then returns the error [fetching=false, stale=false, error=Error, data=undefined]
  // We should check both error and stale to make sure we are not adding or removing "cached" errors
  const { error, stale } = result

  useEffect(() => {
    if (!stale && error) {
      const message = error.networkError
        ? `${error.message} Retrying...`
        : error.message
      setToastId(warn({
        id: "squid-error",
        title: "Squid Error",
        message
      }))
    }
    if (!error && toastId) {
      toast.remove(toastId)
      setToastId(undefined)
    }
  }, [error, stale])

  useEffect(() => {
    if (refresh === undefined || result.fetching) return

    // Refresh every refresh.millis...
    const timerId = setInterval(() => {
      reexecuteQuery({ requestPolicy: "cache-and-network" })
    }, refresh.millis)

    return () => clearTimeout(timerId)
  }, [result.fetching, reexecuteQuery])

  return [result, reexecuteQuery]
}
