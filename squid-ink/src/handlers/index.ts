import {
  contractsCodeStoredEventHandler,
  contractsInstantiatedEventHandler,
  contractsContractEmittedEventHandler,
  contractsContractCodeUpdatedEventHandler,
} from "./contracts-events";
import {
  balancesEndowedEventHandler,
  balancesReservedEventHandler,
  balancesTransferEventHandler,
  balancesWithdrawEventHandler,
} from "./balances-events";
import { contractsCallExtrinsicHandler } from "./contracts-extrinsics";
import { systemNewAccountEventHandler } from "./system-events";
import { genesisBlockHandler } from "./block-prehook";

const eventHandlers = [
  {
    name: "contracts.CodeStored",
    callback: contractsCodeStoredEventHandler,
  },
  {
    name: "contracts.Instantiated",
    callback: contractsInstantiatedEventHandler,
  },
  {
    name: "contracts.ContractEmitted",
    callback: contractsContractEmittedEventHandler,
  },
  {
    name: "contracts.ContractCodeUpdated",
    callback: contractsContractCodeUpdatedEventHandler,
  },
  {
    name: "balances.Transfer",
    callback: balancesTransferEventHandler,
  },
  {
    name: "balances.Endowed",
    callback: balancesEndowedEventHandler,
  },
  {
    name: "balances.Withdraw",
    callback: balancesWithdrawEventHandler,
  },
  {
    name: "balances.Reserved",
    callback: balancesReservedEventHandler,
  },
  {
    name: "system.NewAccount",
    callback: systemNewAccountEventHandler,
  },
];

const extrinsicHandlers = [
  {
    name: "contracts.call",
    callback: contractsCallExtrinsicHandler,
  },
];

const blockPreHookHandlers = [
  {
    name: "genesis_block_handler",
    callback: genesisBlockHandler,
  },
];

export { eventHandlers, extrinsicHandlers, blockPreHookHandlers };
