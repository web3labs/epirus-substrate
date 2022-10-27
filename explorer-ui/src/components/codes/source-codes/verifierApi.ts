export interface VerifierApiParams {
  chain?: string,
  codeHash: string
}

class VerifierApi {
  private api: string
  private ws: string
  private rsc: string

  constructor () {
    this.api = window.__RUNTIME_CONFIG__?.REACT_APP_VERIFIER_ENDPOINT ||
    process.env.REACT_APP_VERIFIER_ENDPOINT ||
    "http://127.0.0.1:3000"

    this.ws = window.__RUNTIME_CONFIG__?.REACT_APP_VERIFIER_WS_ENDPOINT ||
    process.env.REACT_APP_VERIFIER_WS_ENDPOINT ||
    "ws://127.0.0.1:3000"

    this.rsc = window.__RUNTIME_CONFIG__?.REACT_APP_VERIFIER_RSC_ENDPOINT ||
    process.env.REACT_APP_VERIFIER_RSC_ENDPOINT ||
    "http://127.0.0.1:8080"
  }

  async info ({ chain = "local", codeHash } : VerifierApiParams) {
    const res = await fetch(`${this.api}/info/${chain}/${codeHash}`)
    return await res.json()
  }

  async resources ({ chain = "local", codeHash } : VerifierApiParams) {
    const res = await fetch(`${this.rsc}/${chain}/${codeHash}`)
    return await res.json()
  }

  tailWebsocket ({ chain = "local", codeHash } : VerifierApiParams) {
    return new WebSocket(`${this.ws}/tail/${chain}/${codeHash}`)
  }
}

const api = new VerifierApi()
export default api
