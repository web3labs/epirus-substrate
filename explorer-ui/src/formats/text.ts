export function shortenHexString (text?: string, ellipsis: string = "...") {
  return shorten(text, 8, 6, ellipsis)
}

export function shorten (text?: string, start: number = 4, end: number = 4, ellipsis: string = "...") {
  if (text) {
    return text.substring(0, start) +
            ellipsis +
            text.substring(text.length - end)
  } else {
    return null
  }
}
