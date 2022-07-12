// Explanation: https://stackoverflow.com/a/31621312/64949
const MAGIC_CONSTANT = 5381

function djb2a (str: string) {
  let hash = MAGIC_CONSTANT

  for (let index = 0; index < str.length; index++) {
    // Equivalent to: `hash * 33 ^ string.charCodeAt(i)`
    hash = ((hash << 5) + hash) ^ str.charCodeAt(index)
  }

  // Convert it to an unsigned 32-bit integer.
  return hash >>> 0
}

export default function objectHash (obj: Object) {
  // We don't need deterministic serialization
  return djb2a(JSON.stringify(obj))
}
