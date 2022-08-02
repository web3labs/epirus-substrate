import { shorten, shortenHexString, shortenStart, textSpans } from "./text"

test("spans for empty text", () => {
  expect(textSpans()).toEqual([])
})

test("spans for short text", () => {
  expect(textSpans("abc")).toEqual([])
})

test("spans for not matching splitter", () => {
  expect(textSpans("5DjwTXWo3JAcXYMrEeM1NAdFkBY41kjJAAShycryqpQNswgZ", 3, /^7$/)).toEqual([
    "…"
  ])
})

test("spans defaults", () => {
  expect(textSpans(
    "5DjwTXWo3JAcXYMrEeM1NAdFkBY41kjJAAShycryqpQNswgZ"
  )).toEqual([
    "5Djw",
    "TXWo",
    "…",
    "qpQN",
    "swgZ"
  ])
})

test("spans for len", () => {
  expect(textSpans(
    "5DjwTXWo3JAcXYMrEeM1NAdFkBY41kjJAAShycryqpQNswgZ",
    4
  )).toEqual(["5Djw", "…", "swgZ"])
})

test("spans for len with custom ellipsis", () => {
  expect(textSpans(
    "5DjwTXWo3JAcXYMrEeM1NAdFkBY41kjJAAShycryqpQNswgZ",
    4,
    /.{1,4}/g,
    "-"
  )).toEqual(["5Djw", "-", "swgZ"])
})

test("shorten start empty", () => {
  expect(shortenStart()).toBeUndefined()
})

test("shorten start defaults", () => {
  expect(shortenStart(
    "0xfdcc156625126c96aa0d661d54d57e77b1037d05ed9dcd54eea5cdd6511c71f9"
  )).toBe("0xfdcc156625126c…")
})

test("shorten start custom len and ellipsis", () => {
  expect(shortenStart(
    "0xfdcc156625126c96aa0d661d54d57e77b1037d05ed9dcd54eea5cdd6511c71f9",
    6,
    "-"
  )).toBe("0xfdcc-")
})

test("shorten hex string", () => {
  expect(shortenHexString(
    "0xfdcc156625126c96aa0d661d54d57e77b1037d05ed9dcd54eea5cdd6511c71f9"
  )).toBe("0xfdcc15…1c71f9")
})

test("shorten short hex string should not be transformed", () => {
  expect(shortenHexString(
    "0xfdabaa"
  )).toBe("0xfdabaa")
})

test("shorten limit len hex string should not be transformed", () => {
  expect(shortenHexString(
    "0xfdcc151c71f9"
  )).toBe("0xfdcc151c71f9")
})

test("shorten hex by excess 1 should not be transformed", () => {
  expect(shortenHexString(
    "0xfdcc151c71f91"
  )).toBe("0xfdcc151c71f91")
})

test("shorten hex by excess of 3 should be transformed", () => {
  expect(shortenHexString(
    "0xfdcc151c71f9123"
  )).toBe("0xfdcc15…1f9123")
})

test("shorten defaults", () => {
  expect(shorten(
    "5DjwTXWo3JAcXYMrEeM1NAdFkBY41kjJAAShycryqpQNswgZ"
  )).toBe("5Djw…swgZ")
})
