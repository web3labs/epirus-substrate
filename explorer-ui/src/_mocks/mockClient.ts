import { createClient } from "urql"
import { fromValue } from "wonka"

export function createMockClient (data: any) {
  const mockClient = createClient({
    url: "test.mock"
  })

  mockClient.executeQuery = (query) => {
    // TODO impl. different data by query selector
    return fromValue({
      operation: {
        kind: "query",
        context: {
          url: "https://test.mock",
          requestPolicy: "cache-first"
        },
        key: 1,
        query: {} as any
      },
      data,
      query
    }) as any
  }

  return mockClient
}
