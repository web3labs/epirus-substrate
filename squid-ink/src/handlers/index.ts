import { contractsCodeStoredEventHandler, contractsInstantiatedEventHandler } from './contractsEvents'
import { balancesTransferEventHandler } from './balancesEvents'
import { contractsCallExtrinsicHandler } from './contractsExtrinsics';

const eventHandlers = [
  {
    name: "contracts.CodeStored",
    callback: contractsCodeStoredEventHandler
  },
  {
    name: "contracts.Instantiated",
    callback: contractsInstantiatedEventHandler
  },
  {
    name: "balances.Transfer",
    callback: balancesTransferEventHandler
  }
];

const extrinsicHandlers = [
  {
    name: "contracts.call",
    callback: contractsCallExtrinsicHandler
  }
]

export { eventHandlers, extrinsicHandlers } 