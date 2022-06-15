class Hashcode {
  static value (value: any) {
    if (value === null || value === undefined) {
      return 0
    }

    const type = typeof value
    switch (type) {
    case "boolean":
      return Hashcode.boolean(value)

    case "number":
      return Hashcode.number(value)

    case "string":
      return Hashcode.string(value)

    case "object":
      return Hashcode.object(value)

    default:
      throw new Error(`${type} is not yet supported.`)
    }
  }

  static boolean (value: boolean) {
    return Hashcode.number(value ? 1 : 0)
  }

  static number (value: number) {
    const buffer = new ArrayBuffer(8)
    const bufferAsF64 = new Float64Array(buffer)
    const bufferAsI32 = new Int32Array(buffer)

    if (~~value === value) {
      return ~~value
    }

    bufferAsF64[0] = value

    return bufferAsI32[0] ^ bufferAsI32[1]
  }

  static string (value: string) {
    let hash = 37

    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i)
      hash = ((hash << 5) - hash) + charCode
      hash |= 0
    }

    return hash
  }

  static date (value: Date) {
    const typeName = Hashcode.string(value.constructor.name)
    const content = Hashcode.number(value.valueOf())
    return Hashcode.combine(typeName, content)
  }

  static array (value: []) {
    return Hashcode.object(value)
  }

  static object (value: object) : number {
    const typeName = Hashcode.string(value.constructor.name)
    const entries = Object.entries(value)

    if (entries.length === 0) {
      return Hashcode.combine(typeName, 0)
    }

    return Hashcode.combine(typeName, ...entries.map(([key, value]) => {
      return Hashcode.combine(
        Hashcode.value(key),
        Hashcode.value(value)
      )
    }))
  }

  static combine (...hashcodes: number[]) {
    if (hashcodes.length === 0) {
      return 0
    }

    return hashcodes.reduce((a, b) => ((a << 5) + a) ^ b)
  }
}

export default Hashcode
