export function emptyMockPage (dataProp = "edges") {
  return {
    totalCount: 0,
    [dataProp]: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
      endCursor: ""
    }
  }
}

export function mockPageOf (data: any[], dataProp = "edges") {
  const len = data.length
  return {
    totalCount: len * 2,
    [dataProp]: data,
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: "1",
      endCursor: len
    }
  }
}
