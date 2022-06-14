import {
  contractsCodeStoredEventHandler,
  contractsInstantiatedEventHandler,
} from "./contracts-events";
import { balancesTransferEventHandler } from "./balances-events";
import { contractsCallExtrinsicHandler } from "./contracts-extrinsics";

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
    name: "balances.Transfer",
    callback: balancesTransferEventHandler,
  },
];

const extrinsicHandlers = [
  {
    name: "contracts.call",
    callback: contractsCallExtrinsicHandler,
  },
];

export { eventHandlers, extrinsicHandlers };
