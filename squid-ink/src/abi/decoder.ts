import { Abi as SubsquidAbi } from "@subsquid/ink-abi";
import fetch from "node-fetch";
import { Abi as PolkadotAbi } from "@polkadot/api-contract";
import LRUCache from "lru-cache";
import { dataToString } from "../handlers/utils";
import { config } from "../config";
import {
  CodeParams,
  ContractMetadata,
  DecodedElement,
  PolkadotAbiElement,
  RawDecodedElement,
} from "./types";

/**
 * The decoding context.
 *
 * Holds both Subsquid and Polkadot.js ABIs.
 */
export type DecodingContext = {
  subsquidAbi: SubsquidAbi;
  polkadotAbi: PolkadotAbi;
};

/**
 * Squid ink! ABI decoder implementation.
 *
 * Features:
 * - LRU caching of ABI apis.
 * - Comprehensive decoding using Subsquid ABI and Pollkadot ABI.
 * - Integration with ink! verifier server.
 *
 * @class
 */
export class AbiDecoder {
  private verifier: string;

  private cache: LRUCache<string, DecodingContext>;

  constructor() {
    this.verifier = config.verifierEndpoint;
    // TODO configurable
    this.cache = new LRUCache<string, DecodingContext>({
      ttl: 8.64e7, // 1 day
      max: 5000,
      maxSize: 20000000, // 20 MB
      sizeCalculation: (value) => {
        return Buffer.byteLength(JSON.stringify(value));
      },
    });
  }

  async decodeConstructor(
    params: CodeParams
  ): Promise<DecodedElement | undefined> {
    return this.decodeBy("decodeConstructor", "constructors", params);
  }

  async decodeMessage(params: CodeParams): Promise<DecodedElement | undefined> {
    return this.decodeBy("decodeMessage", "messages", params);
  }

  async decodeEvent(params: CodeParams): Promise<DecodedElement | undefined> {
    return this.decodeBy("decodeEvent", "events", params);
  }

  _cacheClear(): void {
    this.cache.clear();
  }

  private async decodeBy(
    subsquidMethodName: "decodeMessage" | "decodeEvent" | "decodeConstructor",
    polkadotAbiKey: "messages" | "events" | "constructors",
    { codeHash, data }: CodeParams
  ): Promise<DecodedElement | undefined> {
    return this.decode(codeHash, (ctx) => {
      const rawElement = ctx.subsquidAbi[subsquidMethodName](
        dataToString(data)
      );

      const polkadotElement = (
        ctx.polkadotAbi[polkadotAbiKey] as PolkadotAbiElement[]
      ).find((am) => am.identifier === rawElement.__kind);

      return this.toDecodedElement(polkadotElement, rawElement);
    });
  }

  private async decode(
    codeHash: string,
    decodeElement: (ctx: DecodingContext) => DecodedElement | undefined
  ): Promise<DecodedElement | undefined> {
    const ctx = await this.resolveDecodingContext(codeHash);
    if (ctx) {
      return decodeElement(ctx);
    }

    return undefined;
  }

  private async resolveDecodingContext(
    codeHash: string
  ): Promise<DecodingContext | undefined> {
    if (this.cache.has(codeHash)) {
      return this.cache.get(codeHash);
    }

    const metadata = await this.fetchMetadata(codeHash);
    if (metadata) {
      // We use PolkadotJS ABI class for proper type decoding
      // But still use SubsquidDecoder to decode instead of PolkadotJS
      // since PolkadotJS decoder API is still unstable
      // and seems to have trouble resolving the selector.
      const subsquidAbi = new SubsquidAbi(metadata);
      const polkadotAbi = new PolkadotAbi(JSON.stringify(metadata));
      const ctx: DecodingContext = {
        subsquidAbi,
        polkadotAbi,
      };

      this.cache.set(codeHash, ctx);

      return ctx;
    }

    return undefined;
  }

  private toDecodedElement(
    polkadotElement: PolkadotAbiElement | undefined,
    rawElement: RawDecodedElement
  ): DecodedElement | undefined {
    const name = rawElement.__kind.toLowerCase();
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
          name: key.toLowerCase(),
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

/**
 * ABI decoder singleton.
 */
const abiDecoder = new AbiDecoder();

export default abiDecoder;
