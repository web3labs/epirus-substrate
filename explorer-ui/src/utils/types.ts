import { Args } from "../types/extrinsic"

export function argValue (args: Args, name: string) {
  return args[name]
}
