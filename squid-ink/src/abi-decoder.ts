import { Abi as SubsquidDecoder } from "@subsquid/ink-abi";
import fetch from "node-fetch";
import { Abi } from "@polkadot/api-contract";
import { toHex } from "@subsquid/util-internal-hex";
import { AbiParam } from "@polkadot/api-contract/types";
import { dataToString } from "./handlers/utils";
import { config } from "./config";

interface ContractMetadata {
  source: JSON;
  contract: JSON;
  spec: JSON;
  storage: JSON;
  types: JSON;
  version: string;
}

export interface DecodedElement {
  name: string;
  args: DecodedElementArg[];
}

interface DecodedElementArg {
  name: string;
  value: string;
  type: string;
  displayName?: string;
}

interface SubsquidDecodedAction {
  __kind: string;
  [k: string]: unknown;
}

type PolkaDotAbiElement = {
  identifier: string;
  args: AbiParam[];
};

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
      const subsquidDecoder = new SubsquidDecoder(metadata);
      const subsquidDecodedAction = subsquidDecoder[decoderMethodName](
        dataToString(params.data)
      ) as SubsquidDecodedAction;
      // TODO rationale of using both ABIs... types stuff shit, polkadot nfojfo.
      const polkadotAbi = new Abi(JSON.stringify(metadata));
      const message = (
        polkadotAbi[polkadotAbiKey] as PolkaDotAbiElement[]
      ).find((am) => am.identifier === subsquidDecodedAction.__kind);
      return this.toDecodeAction(message, subsquidDecodedAction);
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

  private toDecodeAction(
    typeAnnotation: PolkaDotAbiElement | undefined,
    subsquidDecodedAction: SubsquidDecodedAction
  ): DecodedElement | undefined {
    const actionName = subsquidDecodedAction.__kind;
    if (typeAnnotation === undefined) {
      throw new Error(
        `Type annotation by polkadotjs [${actionName}] is not found`
      );
    }

    const decoded: DecodedElement = {
      name: actionName,
      args: [],
    };
    for (const key in subsquidDecodedAction) {
      if (key !== "__kind") {
        const { type: annotatedArgType } = this.findAnnotatedArg(
          typeAnnotation,
          key,
          subsquidDecodedAction
        );
        decoded.args.push({
          name: key,
          value: dataToString(subsquidDecodedAction[key]),
          type: annotatedArgType.type,
          displayName: annotatedArgType.displayName,
        });
      }
    }
    return decoded;
  }

  private findAnnotatedArg(
    annotatedData: PolkaDotAbiElement,
    key: string,
    msg: SubsquidDecodedAction
  ) {
    const annotatedArg = annotatedData.args.find((arg) => arg.name === key);
    if (annotatedArg === undefined) {
      throw new Error(
        `Annotation by polkadotjs for argument [${key}] in message [${msg.__kind}] is not found`
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
