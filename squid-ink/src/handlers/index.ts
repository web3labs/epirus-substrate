import { balancesEventHandlers } from "./balances";
import {
  contractsEventHandlers,
  contractsExtrinsicHandlers,
} from "./contracts";
import { HandlerRegistry } from "./registry";
import { systemEventHandlers } from "./system";
import { EventHandler, ExtrinsicHandler } from "./types";

const eventHandlers: Record<string, EventHandler> = {
  ...balancesEventHandlers,
  ...contractsEventHandlers,
  ...systemEventHandlers,
};

const extrinsicHandlers: Record<string, ExtrinsicHandler> =
  contractsExtrinsicHandlers;

export const registry = new HandlerRegistry({
  extrinsicHandlers,
  eventHandlers,
});
