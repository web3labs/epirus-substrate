import { Abi as SubsquidDecoder } from "@subsquid/ink-abi";
import fetch from "node-fetch";
import { Abi } from "@polkadot/api-contract";
import { toHex } from "@subsquid/util-internal-hex";
import { dataToString } from "../handlers/utils";
import { config } from "../config";
import {
  ContractMetadata,
  DecodedElement,
  PolkadotAbiElement,
  RawDecodedElement,
} from "./types";

class AbiDecoder {
  private verifier: string;

  // TODO: implement proper caching mechanism
  private metadatas: Map<Uint8Array, ContractMetadata>;

  constructor() {
    this.verifier = config.verifierEndpoint;
    this.metadatas = new Map<Uint8Array, ContractMetadata>();
  }

  decodeConstructor(params: {
    codeHash: Uint8Array;
    data: string | Buffer | Uint8Array | BigInt | undefined;
  }): Promise<DecodedElement | undefined> {
    return this.decodeBy("decodeConstructor", "constructors", params);
  }

  async decodeMessage(params: {
    codeHash: Uint8Array;
    data: string | Buffer | Uint8Array | BigInt | undefined;
  }): Promise<DecodedElement | undefined> {
    return this.decodeBy("decodeMessage", "messages", params);
  }

  async decodeEvent(params: {
    codeHash: Uint8Array;
    data: string | Buffer | Uint8Array | BigInt | undefined;
  }): Promise<DecodedElement | undefined> {
    return this.decodeBy("decodeEvent", "events", params);
  }

  private async getMetadata(codeHash: Uint8Array) {
    return this.metadatas.has(codeHash)
      ? this.metadatas.get(codeHash)
      : this.fetchMetadata(codeHash);
  }

  private async decodeBy(
    decoderMethodName: "decodeMessage" | "decodeEvent" | "decodeConstructor",
    polkadotAbiKey: "messages" | "events" | "constructors",
    params: {
      codeHash: Uint8Array;
      data: string | Buffer | Uint8Array | BigInt | undefined;
    }
  ): Promise<DecodedElement | undefined> {
    return this.decode(params, (metadata) => {
      // Subsquid ABI class
      // We use this to decode instead of PolkadotJS since PolkadotJS decoder API is still unstable
      // and seems to have trouble resolving the selector
      const decoder = new SubsquidDecoder(metadata);
      const rawElement = decoder[decoderMethodName](
        dataToString(params.data)
      ) as RawDecodedElement;

      // PolkadotJS ABI class
      // contains decoded Substrate types and display types for each arg that are easy to consume
      const polkadotAbi = new Abi(JSON.stringify(metadata));
      const polkadotElement = (
        polkadotAbi[polkadotAbiKey] as PolkadotAbiElement[]
      ).find((am) => am.identifier === rawElement.__kind);

      return this.toDecodedElement(polkadotElement, rawElement);
    });
  }

  private async decode(
    {
      codeHash,
      data,
    }: {
      codeHash: Uint8Array;
      data: string | Buffer | Uint8Array | BigInt | undefined;
    },
    cb: (metadata: ContractMetadata) => DecodedElement | undefined
  ): Promise<DecodedElement | undefined> {
    if (data) {
      const metadata = await abiDecoder.getMetadata(codeHash);
      if (metadata) {
        return cb(metadata);
      }
    }
    return undefined;
  }

  private toDecodedElement(
    polkadotElement: PolkadotAbiElement | undefined,
    rawElement: RawDecodedElement
  ): DecodedElement | undefined {
    const name = rawElement.__kind;
    if (polkadotElement === undefined) {
      throw new Error(`Element "${name}" is not found in polkadot.js ABI`);
    }

    const decoded: DecodedElement = {
      name,
      args: [],
    };
    for (const key in rawElement) {
      if (key !== "__kind") {
        const { type: annotatedArgType } = this.findAnnotatedArg(
          key,
          polkadotElement,
          rawElement
        );
        decoded.args.push({
          name: key,
          value: dataToString(rawElement[key]),
          type: annotatedArgType.type,
          displayName: annotatedArgType.displayName,
        });
      }
    }
    return decoded;
  }

  private findAnnotatedArg(
    key: string,
    polkadotElement: PolkadotAbiElement,
    rawElement: RawDecodedElement
  ) {
    const annotatedArg = polkadotElement.args.find((arg) => arg.name === key);
    if (annotatedArg === undefined) {
      throw new Error(
        `Annotation by polkadot.js for argument "${key}" in message "${rawElement.__kind}" is not found`
      );
    }
    return annotatedArg;
  }

  private async fetchMetadata(codeHash: Uint8Array) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const res = await fetch(
      `${this.verifier}/contracts/${toHex(codeHash)}/metadata.json`
    );

    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200) {
      throw new Error("Error from verifier server");
    }

    // Patch for v4 metadata generated with ink alpha.4 which is missing lang_error
    // needed ATM for contracts in local contracts node
    const metadata = (await res.json()) as Record<string, unknown>;
    if (
      "version" in metadata &&
      metadata.version === "4" &&
      "spec" in metadata &&
      !("lang_error" in (metadata.spec as Record<string, unknown>))
    ) {
      (metadata.spec as Record<string, unknown>).lang_error = {
        displayName: ["ink", "LangError"],
        type: 6,
      };
    }

    return metadata as unknown as ContractMetadata;
  }
}

const abiDecoder = new AbiDecoder();

export default abiDecoder;
