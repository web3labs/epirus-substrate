export interface ResolvedContractsCallCall {
  contractAddress: string;
  value?: bigint;
  gasLimit?: bigint;
  storageDepositLimit?: bigint | undefined;
  data?: Uint8Array;
}

export interface ResolvedContractsSetCodeCall {
  contractAddress: string;
  codeHash: string;
}

export interface ResolvedBalancesTransferEvent {
  from: string;
  to: string;
  amount: bigint;
}

export interface ResolvedBalancesEndowedEvent {
  account: string;
  freeBalance: bigint;
}

export interface ResolvedBalancesWithdrawEvent {
  account: string;
  amount: bigint;
}

export interface ResolvedBalancesReservedEvent {
  account: string;
  amount: bigint;
}

export interface ResolvedContractsInstantiatedEvent {
  deployer: string;
  contract: string;
}

export interface ResolvedContractCodeRemovedEvent {
  codeHash: string;
}

export interface ResolvedContractsCodeStoredEvent {
  codeHash: string;
}

export interface ResolvedContractsCodeUpdatedEvent {
  contract: string;
  newCodeHash: string;
  oldCodeHash: string;
}

export interface ResolvedContractEmittedEvent {
  contract: string;
  data: Uint8Array;
}

export interface ResolvedContractTerminatedEvent {
  contract: string;
  beneficiary: string;
}

export interface ResolvedNewAccountEvent {
  account: string;
}
