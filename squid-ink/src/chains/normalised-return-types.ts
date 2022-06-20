export interface ResolvedContractsCallCall {
  contractAddress: string;
  value?: bigint;
  gasLimit?: bigint;
  storageDepositLimit?: bigint | undefined;
  data?: Uint8Array;
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

export interface ResolvedContractsCodeStoredEvent {
  codeHash: string;
}

export interface ResolvedContractEmittedEvent {
  contract: string;
  data: Uint8Array;
}

export interface ResolvedNewAccountEvent {
  account: string;
}
