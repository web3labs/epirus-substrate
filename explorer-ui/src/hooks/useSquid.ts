import { useEffect } from "react"
import { useQuery } from "urql"
import { PageQuery } from "../types/pagination"

interface Props {
  query: string,
  variables: PageQuery,
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
}: Props) {
  const [result, reexecuteQuery] = useQuery({
    query,
    variables
  })

  useEffect(() => {
    if (refresh.disabled || result.fetching) return

    // Refresh every refresh.millis...
    const timerId = setInterval(() => {
      reexecuteQuery({ requestPolicy: "cache-and-network" })
    }, refresh.millis)

    return () => clearTimeout(timerId)
  }, [result.fetching, reexecuteQuery])

  return [result]
}
