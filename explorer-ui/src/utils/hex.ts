/**
 * Convert a hex string to a byte array
 */
export function hexToBytes (hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)

  for (let c = 0; c < hex.length; c += 2) {
    bytes[c / 2] = parseInt(hex.substring(c, c + 2), 16)
  }

  return bytes
}

/**
   * Convert a byte array to a hex string
   */
export function bytesToHex (bytes: Uint8Array): string {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "")
}

/**
   * Returns a hexified representation of the given byte.
   *
   * @param byte the byte value
   * @param padding padding length
   * @returns a hexified representation
   */
export function hexify (byte: number, padding: number): string {
  return byte
    .toString(16)
    .toUpperCase()
    .padStart(padding, "0")
}

/**
   * Converts a uint8 array to an ascii string.
   *
   * @param bytes the bytes to convert
   * @returns an ascii string
   */
export function bytestoAscii (bytes: Uint8Array): string {
  return bytes.reduce(
    (str, byte) => (byte > 0x1f && byte < 0x80 ? str + String.fromCharCode(byte) : str + "."),
    ""
  )
}

/**
 * Converts hex string to UTF-8
 * @param str Hex string
 * @returns UTF-8 tring
 */
export function hexStringToUTF8 (str: string): string {
  const utf8TextDecoder = new TextDecoder("UTF-8")
  return utf8TextDecoder.decode(hexToBytes(str.substring(2)))
}
