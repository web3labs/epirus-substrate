import { Args } from "../types/extrinsic"

export function getArgValue (args: Args | undefined | null, name: string = "value") {
  if (args === undefined || args === null) {
    return null
  }

  const va = getArg(args, name)

  if (va === "0" || va === 0 || va === undefined) {
    return null
  }

  return va
}

export function getArg (args: Args, name: string) {
  return args[name]
}
