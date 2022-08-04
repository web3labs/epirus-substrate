/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type AddressTypes = "Id" | "Index" | "unknown";

export interface MultiAddress {
  __kind: string;
  value: string;
}

export type CallTypes = "Contracts.call" | "Contracts.instantiate_with_code";

export type EventTypes =
  | "Contracts.ContractEmitted"
  | "Contracts.Instantiated"
  | "Contracts.CodeStored"
  | "Contracts.ContractCodeUpdated"
  | "Contracts.CodeRemoved"
  | "Contracts.Terminated"
  | "Balances.Transfer"
  | "Balances.Withdraw"
  | "Balances.Reserved"
  | "Balances.Endowed"
  | "System.NewAccount";

export interface Ctx {
  _chain: any;
  store: any;
  log: any;
  blocks: any;
}
