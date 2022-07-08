import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import { Logger } from "@subsquid/logger";
import {
  Ctx,
  EventHandlerCallback,
  EventItem,
  ExtrinsicHandlerCallback,
  Item,
  ItemHandler,
  Event,
  CallItem,
} from "./handlers/types";
import { eventHandlers, extrinsicHandlers } from "./handlers";

export class HandlerDirectory {
  eventHandlers: Map<string, EventHandlerCallback>;

  extrinsicHandlers: Map<string, ExtrinsicHandlerCallback>;

  constructor() {
    this.eventHandlers = new Map();
    this.extrinsicHandlers = new Map();
  }

  registerHandlers(): HandlerDirectory {
    this.registerEventHandlers();
    this.registerExtrinsicHandlers();
    return this;
  }

  registerEventHandlers(): void {
    for (const handler of Object.values(eventHandlers)) {
      this.eventHandlers.set(handler.name, handler.handle);
    }
  }

  registerExtrinsicHandlers(): void {
    for (const handler of Object.values(extrinsicHandlers)) {
      this.extrinsicHandlers.set(handler.name, handler.handle);
    }
  }

  getHandlerForItem(item: Item, log: Logger): ItemHandler | undefined {
    const handlerLog = log.child("handler-directory");
    switch (item.kind) {
      case "event": {
        const eventItem = <EventItem>item;
        const handler = this.eventHandlers.get(eventItem.name);
        if (!handler) {
          handlerLog.warn(
            { name: eventItem.name },
            "No event handler found for item"
          );
          return undefined;
        }
        const curried = (event: Event) => {
          return async (ctx: Ctx, block: SubstrateBlock) =>
            handler(ctx, event, block);
        };
        return curried(eventItem.event);
      }
      case "call": {
        const callItem = <CallItem>item;
        const handler = this.extrinsicHandlers.get(callItem.name);
        if (!handler) {
          handlerLog.warn(
            { name: callItem.name },
            "No call handler found for item"
          );
          return undefined;
        }
        const curried = (
          call: SubstrateCall,
          extrinsic: SubstrateExtrinsic
        ) => {
          return async (ctx: Ctx, block: SubstrateBlock) =>
            handler(ctx, call, extrinsic, block);
        };
        return curried(callItem.call, callItem.extrinsic);
      }
      default:
        throw new Error(
          `Kind of item [${
            item.kind
          }] unknown when getting handler for item ${JSON.stringify(item)}`
        );
    }
  }
}
