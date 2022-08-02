import crypto from "crypto"

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

export function randomHex () {
  const len = Math.floor((Math.random() * 128) + 2)
  return "0x" + crypto.randomBytes(len).toString("hex")
}

export function randomId (length = 32) {
  let result = ""
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function randomCodeHash () {
  return "0x" + crypto.randomBytes(32).toString("hex")
}

export function randomAccountId () {
  return randomId(64)
}

export function buildArrayOf (n: number, f: (index: number) => Object) {
  return [...Array(n)].map((_, i) => f(i))
}
