/**
 * Version 4 of ink! project metadata.
 */
export interface InkMetadata {
  source: JSON;
  contract: JSON;
  spec: InkContractSpec;
  /**
   * The layout of the storage data structure
   */
  storage: Record<string, unknown>;
  types: Record<string, unknown>;
  version: string;
}

/**
 * Describes a contract.
 */
export interface InkContractSpec {
  /**
   * The set of constructors of the contract.
   */
  constructors: InkContractEventSpec[];
  /**
   * The contract documentation.
   */
  docs: string[];
  /**
   * The events of the contract.
   */
  events: InkContractEventSpec[];
  /**
   * The external messages of the contract.
   */
  messages: InkContractEventSpec[];
  [k: string]: unknown;
}

/**
 * Describes a constructor of a contract.
 */
export interface InkContractEventSpec {
  args: ContractArgs[];
  label: string;
  [k: string]: unknown;
}

/**
 * Describes a pair of parameter label and type.
 */
export interface ContractArgs {
  /**
   * The label of the parameter.
   */
  label: string;
  /**
   * The type of the parameter.
   */
  type: TypeSpec;
  [k: string]: unknown;
}

/**
 * A type specification.
 *
 * This contains the actual type as well as an optional compile-time known displayed representation of the type.
 * This is useful for cases where the type is used through a type alias in order to provide information about the alias name.
 *
 */
export interface TypeSpec {
  /**
   * The compile-time known displayed representation of the type.
   */
  displayName: string[];
  /**
   * The actual type.
   */
  type: number;
  [k: string]: unknown;
}
