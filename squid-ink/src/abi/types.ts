import { AbiParam } from "@polkadot/api-contract/types";

export type CodeParams = {
  codeHash: string;
  data: string | Buffer | Uint8Array | BigInt;
};

export interface ContractMetadata {
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

export interface DecodedElementArg {
  name: string;
  value: string;
  type: string;
  displayName?: string;
}

/**
 * Representation of a decoded element
 * provided by Subsquid.
 */
export interface RawDecodedElement {
  __kind: string;
  [k: string]: unknown;
}

/**
 * Represents the minimal information need from
 * the Polkadot.js ABI element.
 */
export type PolkadotAbiElement = {
  identifier: string;
  args: AbiParam[];
};
