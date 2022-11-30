import { formatBytes } from "./bytes"

test("format 0 bytes", () => {
  expect(formatBytes(0)).toEqual("0 Bytes")
})

test("format negative bytes", () => {
  expect(formatBytes(-1)).toEqual("0 Bytes")
})

test("format 10 kilobytes", () => {
  expect(formatBytes(10240)).toEqual("10 kB")
})

test("format ~9 MB", () => {
  expect(formatBytes(10000000)).toEqual("9.54 MB")
})

test("format ~9 MB negative decimals", () => {
  expect(formatBytes(10000000, -1)).toEqual("10 MB")
})

test("format ~9 MB no decimals", () => {
  expect(formatBytes(10000000, 0)).toEqual("10 MB")
})

test("format ~9 MB with 4 decimals", () => {
  expect(formatBytes(10000000, 4)).toEqual("9.5367 MB")
})

test("format 1 MB", () => {
  expect(formatBytes(Math.pow(1024, 2))).toEqual("1 MB")
})

test("format 1 GB", () => {
  expect(formatBytes(Math.pow(1024, 3))).toEqual("1 GB")
})

test("format 1 TB", () => {
  expect(formatBytes(Math.pow(1024, 4))).toEqual("1 TB")
})

test("format 1 PB", () => {
  expect(formatBytes(Math.pow(1024, 5))).toEqual("1 PB")
})
