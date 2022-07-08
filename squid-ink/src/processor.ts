import "./initialise";
import { SubstrateBatchProcessor } from "@subsquid/substrate-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import { ChainPropertiesManager } from "./chain-config";
import { HandlerDirectory } from "./handlerDirectory";

const processor = new SubstrateBatchProcessor()
  .setBlockRange({ from: 0 })
  .setBatchSize(500)
  .setDataSource({
    chain: process.env.WS_ENDPOINT || "http://127.0.0.1:9944",
    // Lookup archive by the network name in the Subsquid registry
    // archive: lookupArchive("shibuya", { release: "FireSquid" }),
    archive: process.env.ARCHIVE_ENDPOINT || "http://127.0.0.1:8888/graphql",
  })
  .addEvent("Balances.Transfer")
  .addEvent("System.NewAccount")
  .addEvent("Balances.Withdraw")
  .addEvent("Balances.Reserved")
  .addEvent("Balances.Endowed")
  .addEvent("Contracts.Instantiated")
  .addEvent("Contracts.CodeStored")
  .addEvent("Contracts.ContractCodeUpdated")
  .addEvent("Contracts.ContractEmitted")
  .addCall("Contracts.call");

const handlerDirectory = new HandlerDirectory().registerHandlers();
const chainPropertiesManager = new ChainPropertiesManager();

processor.run(new TypeormDatabase(), async (ctx) => {
  await chainPropertiesManager.storeChainProperties(ctx);
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      try {
        const handler = handlerDirectory.getHandlerForItem(item, ctx.log);
        if (handler) {
          await handler(ctx, block.header);
        }
      } catch (error) {
        ctx.log.error(<Error>error, "Error while handling block items");
      }
    }
  }
});
