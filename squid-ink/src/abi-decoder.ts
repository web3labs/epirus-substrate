import { Abi as SubsquidDecoder } from "@subsquid/ink-abi";
import fetch from "node-fetch";
import { Abi } from "@polkadot/api-contract";
import { toHex } from "@subsquid/util-internal-hex";
import {
  AbiConstructor,
  AbiEvent,
  AbiMessage,
} from "@polkadot/api-contract/types";
import { dataToString } from "./handlers/utils";
import { ContractActionType } from "./model";
import { config } from "./config";

interface ContractMetadata {
  source: JSON;
  contract: JSON;
  spec: JSON;
  storage: JSON;
  types: JSON;
  version: string;
}

interface DecodedAction {
  name: string;
  args: DecodedActionArg[];
}

interface DecodedActionArg {
  name: string;
  value: string;
  type: string;
  displayName?: string;
}

interface SubsquidDecodedAction {
  __kind: string;
  [k: string]: unknown;
}

class AbiDecoder {
  private verifier: string;

  // TODO: implement proper caching mechanism
  private metadatas: Map<Uint8Array, ContractMetadata>;

  constructor() {
    this.verifier = config.verifierEndpoint;
    this.metadatas = new Map<Uint8Array, ContractMetadata>();
  }

  async getMetadata(codeHash: Uint8Array) {
    return this.metadatas.has(codeHash)
      ? this.metadatas.get(codeHash)
      : this.fetchMetadata(codeHash);
  }

  decode(
    metadata: ContractMetadata,
    data: string | Buffer | BigInt | Uint8Array,
    type: ContractActionType
  ) {
    const subsquidDecoder = new SubsquidDecoder(metadata);
    const decodeMethod = this.getDecodeMethodByActionType(type);
    const subsquidDecodedAction = subsquidDecoder[decodeMethod](
      dataToString(data)
    ) as SubsquidDecodedAction;
    const actionName = subsquidDecodedAction.__kind;

    const typeAnnotation = this.getTypeAnnotationByActionType(
      metadata,
      actionName,
      type
    );
    if (typeAnnotation === undefined) {
      throw new Error(
        `Type annotation by polkadotjs [${actionName}] is not found`
      );
    }

    const decoded: DecodedAction = {
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

  private getDecodeMethodByActionType(type: ContractActionType) {
    switch (type) {
      case ContractActionType.MESSAGE:
        return "decodeMessage";
      case ContractActionType.EVENT:
        return "decodeEvent";
      case ContractActionType.CONSTRUCTOR:
        return "decodeConstructor";
      default:
        throw new Error("Unknown type to decode");
    }
  }

  private getTypeAnnotationByActionType(
    metadata: ContractMetadata,
    name: string,
    type: ContractActionType
  ) {
    const annotatedAbi = new Abi(JSON.stringify(metadata));

    switch (type) {
      case ContractActionType.MESSAGE:
        return annotatedAbi.messages.find((am) => am.identifier === name);
      case ContractActionType.EVENT:
        return annotatedAbi.events.find((am) => am.identifier === name);
      case ContractActionType.CONSTRUCTOR:
        return annotatedAbi.constructors.find((am) => am.identifier === name);
      default:
        throw new Error("Unknown type to decode");
    }
  }

  private findAnnotatedArg(
    annotatedData: AbiMessage | AbiEvent | AbiConstructor,
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
