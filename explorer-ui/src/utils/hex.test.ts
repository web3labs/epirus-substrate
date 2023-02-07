import { bytestoAscii, bytesToHex, hexify, hexStringToUTF8, hexToBytes } from "./hex"

test("convert hex string to bytes", () => {
  expect(hexToBytes("000a0b0c")).toEqual(Uint8Array.from([0, 10, 11, 12]))
})

test("convert bytes to hex string", () => {
  expect(bytesToHex(Uint8Array.from([0, 10, 11, 12]))).toEqual("000a0b0c")
})

test("hexify byte without padding", () => {
  expect(hexify(0xFA, 0)).toEqual("FA")
})

test("hexify byte with padding", () => {
  expect(hexify(250, 4)).toEqual("00FA")
})

test("bytes to ASCII", () => {
  expect(bytestoAscii(Uint8Array.from([0x48, 0x45, 0x4c, 0x4c, 0x4f, 0x00]))).toEqual(
    "HELLO."
  )
})

test("hex string to UTF-8", () => {
  const { TextDecoder, TextEncoder } = require("util")
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder

  expect(hexStringToUTF8("0x6c6f72656d212a697073756d20313233")).toEqual(
    "lorem!*ipsum 123"
  )
  expect(hexStringToUTF8("0xF09F988120313233")).toEqual(
    "😁 123"
  )
})
