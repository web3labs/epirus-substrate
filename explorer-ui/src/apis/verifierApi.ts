import { ContractMetadata } from "../components/codes/sources/MetadataView"

export interface VerifierApiParams {
  chain?: string,
  codeHash: string
}

export interface ResourceInfo {
  name: string
  type: string
  mtime: string
  size?: number
}

interface FileData {
  type: "file"
  data: string
}

export interface StructureData {
  type: "json"
  data: ResourceInfo[]
}

export type ResourceData = FileData | StructureData

export interface ErrorResponse {
  code: number,
  message: string
}

export interface InfoResponse {
  status: "unverified" | "metadata" | "verified" | "processing" | "staging" | "error",
  timestamp: string
}

export type ApiResponse<T> = T | ErrorResponse

/**
 * Exposes source code verification server APIs.
 * https://github.com/web3labs/ink-verifier-server
 */
class VerifierApi {
  private api: string
  private ws: string

  constructor () {
    this.api = window.__RUNTIME_CONFIG__?.REACT_APP_VERIFIER_ENDPOINT ||
    process.env.REACT_APP_VERIFIER_ENDPOINT ||
    "http://127.0.0.1:3000"

    this.ws = window.__RUNTIME_CONFIG__?.REACT_APP_VERIFIER_WS_ENDPOINT ||
    process.env.REACT_APP_VERIFIER_WS_ENDPOINT ||
    "ws://127.0.0.1:3000"
  }

  async info ({ chain = "local", codeHash } : VerifierApiParams) {
    const res = await fetch(`${this.api}/info/${chain}/${codeHash}`)
    return await res.json() as ApiResponse<InfoResponse>
  }

  async verify (
    { chain = "local", codeHash } : VerifierApiParams,
    formData: FormData
  ) : Promise<Response> {
    return fetch(`${this.api}/verify/${chain}/${codeHash}`, {
      method: "POST",
      body: formData
    })
  }

  async uploadMetadata (
    { chain = "local", codeHash } : VerifierApiParams,
    formData: FormData
  ) : Promise<Response> {
    return fetch(`${this.api}/upload/${chain}/${codeHash}`, {
      method: "POST",
      body: formData
    })
  }

  async metadata (codeHash: string) {
    const res = await fetch(`${this.api}/contracts/${codeHash}/metadata.json`)
    return await res.json() as ApiResponse<ContractMetadata>
  }

  async directoryList (codeHash: string) {
    const res = await fetch(`${this.api}/contracts/${codeHash}/src`)
    return await res.json()
  }

  async resource (params : { codeHash: string, path: string }) {
    return await fetch(this.resourceDownloadLink(params))
  }

  resourceDownloadLink ({ codeHash, path } : { codeHash: string, path: string }) {
    return `${this.api}/contracts/${codeHash}/src/${path}`
  }

  errorLogDownloadLink ({ chain = "local", codeHash } : VerifierApiParams) {
    return `${this.api}/contracts/${chain}/${codeHash}/error.log`
  }

  tailWebsocket ({ chain = "local", codeHash } : VerifierApiParams) {
    return new WebSocket(`${this.ws}/tail/${chain}/${codeHash}`)
  }
}

const api = new VerifierApi()
export default api
