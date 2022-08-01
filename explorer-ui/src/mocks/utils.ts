export function emptyPage (dataProp = "edges") {
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

export function testPageOf (data: any, dataProp = "edges") {
  return {
    totalCount: 10,
    [dataProp]: data,
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: false,
      startCursor: "1",
      endCursor: "5"
    }
  }
}
