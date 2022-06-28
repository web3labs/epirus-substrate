import { Arg } from "../types/extrinsic"

export function argValue (args: Arg[], name: string) {
  return args.find(a => a.name === name)?.value
}
