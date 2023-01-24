// Dynamic module init must be imported first
import "./initialise";

import { SubstrateBatchProcessor } from "@subsquid/substrate-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { createLogger } from "@subsquid/logger";
import { Item } from "handlers/types";
import { ChainPropertiesStore } from "./chain-config";
import { registry } from "./handlers";
import { config } from "./config";

const logger = createLogger("sys:init");

logger.info(
  {
    eventHandlers: registry.eventNames,
    callHandlers: registry.callNames,
  },
  "Handlers Registry"
);

logger.info(config, "Instantiating Squid Processor");

let processor = new SubstrateBatchProcessor()
  .setBlockRange(config.blockRange)
  .setBatchSize(config.batchSize)
  .setDataSource(config.dataSource);

for (const name of registry.eventNames) {
  processor = processor.addEvent(name) as SubstrateBatchProcessor;
}

for (const name of registry.callNames) {
  processor = processor.addCall(name) as SubstrateBatchProcessor;
}

const chainPropertiesStore = new ChainPropertiesStore();

process.on("uncaughtException", (err) => {
  logger.fatal(err, "There was an uncaught error");
  process.exit(1);
});

processor.run(new TypeormDatabase(), async (ctx) => {
  await chainPropertiesStore.save(ctx);

  const { log } = ctx;

  for (const { items, header } of ctx.blocks) {
    for (const item of items) {
      try {
        const handler = registry.resolve(item as unknown as Item);
        if (handler) {
          log.debug({ item, header }, "Handling item");
          await handler(ctx, header);
        } else {
          // Calls and extrinsics that we are not handling comes together
          // with some events that we are (balances and systems events).
          // There will be no handlers found but it's not an error
          log.debug(item, "No handler found for item");
        }
      } catch (error) {
        log.error(
          { item, error: <Error>error },
          "Error while handling block items"
        );
      }
    }
  }
});
