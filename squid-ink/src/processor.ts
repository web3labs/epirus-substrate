// Dynamic module init must be imported first
import "./initialise";

import { SubstrateBatchProcessor } from "@subsquid/substrate-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { createLogger } from "@subsquid/logger";
import { ChainPropertiesStore } from "./chain-config";
import { registry } from "./handlers";

const logger = createLogger("sys:init");

const params = {
  blockRange: { from: 0 },
  batchSize: 500,
  dataSource: {
    chain: process.env.WS_ENDPOINT || "http://127.0.0.1:9944",
    // Lookup archive by the network name in the Subsquid registry
    // archive: lookupArchive("shibuya", { release: "FireSquid" }),
    archive: process.env.ARCHIVE_ENDPOINT || "http://127.0.0.1:8888/graphql",
  },
};

logger.info(
  {
    eventHandlers: registry.eventNames,
    callHandlers: registry.callNames,
  },
  "Handlers Registry"
);

logger.info(params, "Instantiating Squid Processor");

let processor = new SubstrateBatchProcessor()
  .setBlockRange(params.blockRange)
  .setBatchSize(params.batchSize)
  .setDataSource(params.dataSource);

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
        const handler = registry.resolve(item);
        if (handler) {
          await handler(ctx, header);
        } else {
          log.debug(item, "No handler found for item");
        }
      } catch (error) {
        log.error(<Error>error, "Error while handling block items");
      }
    }
  }
});
