import {
  SubstrateBlock,
  SubstrateCall,
  SubstrateExtrinsic,
} from "@subsquid/substrate-processor";
import {
  Ctx,
  EventHandlerCallback,
  ExtrinsicHandlerCallback,
  Item,
  ItemHandler,
  EventHandler,
  ExtrinsicHandler,
  Event,
} from "./types";

/**
 * The handlers registry implementation.
 *
 * @class
 */
export class HandlerRegistry {
  private eventHandlers: Map<string, EventHandlerCallback>;

  private extrinsicHandlers: Map<string, ExtrinsicHandlerCallback>;

  constructor({
    eventHandlers,
    extrinsicHandlers,
  }: {
    eventHandlers: Record<string, EventHandler>;
    extrinsicHandlers: Record<string, ExtrinsicHandler>;
  }) {
    this.eventHandlers = new Map();
    this.extrinsicHandlers = new Map();

    for (const handler of Object.values(eventHandlers)) {
      this.eventHandlers.set(handler.name, handler.handle);
    }
    for (const handler of Object.values(extrinsicHandlers)) {
      this.extrinsicHandlers.set(handler.name, handler.handle);
    }
  }

  get eventNames(): string[] {
    return [...this.eventHandlers.keys()];
  }

  get callNames(): string[] {
    return [...this.extrinsicHandlers.keys()];
  }

  resolve(item: Item): ItemHandler | undefined {
    switch (item.kind) {
      case "event": {
        const eventItem = item;
        const handler = this.eventHandlers.get(eventItem.name);

        if (handler === undefined) {
          return undefined;
        }

        const curried = (event: Event) => {
          return async (ctx: Ctx, block: SubstrateBlock) =>
            handler(ctx, event, block);
        };
        return curried(eventItem.event);
      }
      case "call": {
        const callItem = item;
        const handler = this.extrinsicHandlers.get(callItem.name);

        if (handler === undefined) {
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
          `Unknown when getting handler for item ${JSON.stringify(item)}`
        );
    }
  }
}
