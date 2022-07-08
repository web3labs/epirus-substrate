import { balancesEventHandlers } from "./balances";
import {
  contractsEventHandlers,
  contractsExtrinsicHandlers,
} from "./contracts";
import { systemEventHandlers } from "./system";

const eventHandlers = Object.assign(
  balancesEventHandlers,
  contractsEventHandlers,
  systemEventHandlers
);

const extrinsicHandlers = contractsExtrinsicHandlers;

export { eventHandlers, extrinsicHandlers };
