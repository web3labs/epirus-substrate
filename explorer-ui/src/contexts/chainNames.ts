/**
 * Maps 'system.chain' value to the expected
 * polkadot.js configuration info name.
 */
const names = [
  {
    chain: "aleph zero",
    endpoint: "aleph-testnet"
  },
  {
    chain: "contracts on rococo",
    endpoint: "rococoContracts"
  },
  {
    chain: "shibuya testnet",
    endpoint: "shibuya"
  },
  {
    chain: "watr network",
    endpoint: "watr"
  },
  {
    chain: "local contracts chain",
    endpoint: "local"
  }
]

export default function resolveInfoFromName (chain : string) : string {
  const lc = chain.toLocaleLowerCase()
  const found = names.find(n => n.chain === lc)
  if (found) {
    return found.endpoint
  }
  throw new Error(`No chain name was found for '${lc}' in ${JSON.stringify(names, null, 2)}`)
}
