export function shortenHexString (text?: string, ellipsis: string = "…") {
  return shorten(text, 8, 6, ellipsis)
}

export function shorten (text?: string, start: number = 4, end: number = 4, ellipsis: string = "…") {
  if (text) {
    return text.substring(0, start) +
            ellipsis +
            text.substring(text.length - end)
  } else {
    return null
  }
}

export function shortenStart (text?: string, max: number = 16, ellipsis: string = "…") {
  if (text && text.length > max) {
    return text.substring(0, max) + ellipsis
  } else {
    return text
  }
}

export function textSpans (
  text?: string,
  charsNum: number = 8,
  groupRegExp : RegExp = /.{1,4}/g,
  ellipsis: string = "…"
): string[] {
  const str = text?.replace("0x", "").trim()
  if (str && str.length > (charsNum * 2)) {
    return ([] as string[])
      .concat(str.substring(0, charsNum).match(groupRegExp) || [])
      .concat(ellipsis)
      .concat(str.substring(str.length - charsNum).match(groupRegExp) || [])
  } else {
    return []
  }
}
