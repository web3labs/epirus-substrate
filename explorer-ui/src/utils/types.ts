import { Arg } from "../types/contracts"

export function argValue (args: Arg[], name: string) {
  return args.find(a => a.name === name)?.value
}
