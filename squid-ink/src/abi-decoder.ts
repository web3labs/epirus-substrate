import { Abi } from "ink-abi";
import fetch from "node-fetch";
import { config } from "./config";

interface ContractMetadata {
  source: JSON;
  contract: JSON;
  spec: JSON;
  storage: JSON;
  types: JSON;
  version: string;
}

export enum DecodeType {
  CONSTRUCTOR = "constructor",
  EVENT = "event",
  MESSAGE = "message",
}

class AbiDecoder {
  private verifier: string;

  private metadatas: Map<string, ContractMetadata>;

  constructor() {
    this.verifier = config.verifierEndpoint;
    this.metadatas = new Map<string, ContractMetadata>();
  }

  async decode(codeHash: string, data: string, type: DecodeType) {
    let decoded: unknown | undefined;
    try {
      const metadata = await this.getMetadata(codeHash);
      if (metadata) {
        const abi = new Abi(metadata);
        try {
          switch (type) {
            case DecodeType.MESSAGE:
              decoded = abi.decodeMessage(data);
              break;
            case DecodeType.EVENT:
              decoded = abi.decodeEvent(data);
              break;
            default:
              decoded = abi.decodeConstructor(data);
          }
        } catch (error) {
          throw new Error(
            `Unable to decode from contract metadata for codeHash ${codeHash}`
          );
        }
      }
    } catch (error) {
      console.log(`Error while decoding codeHash: ${codeHash}`, error);
    }
    return decoded;
  }

  private async getMetadata(codeHash: string) {
    return this.metadatas.has(codeHash)
      ? this.metadatas.get(codeHash)
      : this.fetchMetadata(codeHash);
  }

  private async fetchMetadata(codeHash: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const res = await fetch(
      `${this.verifier}/contracts/${codeHash}/metadata.json`
    );

    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200) {
      throw new Error("Error from verifier server");
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    return (await res.json()) as ContractMetadata;
  }
}

const abiDecoder = new AbiDecoder();

export default abiDecoder;
