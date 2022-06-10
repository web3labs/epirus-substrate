import {
  SubstrateProcessor,
} from "@subsquid/substrate-processor";
import { eventHandlers, extrinsicHandlers } from "./handlers";

// TO DO: Extract to config file
const processor = new SubstrateProcessor("contracts_poc");

processor.setBatchSize(500);
// processor.setBlockRange({ from: 0 });
processor.setDataSource({
  archive: "http://localhost:4010/v1/graphql",
  chain: "ws://127.0.0.1:9944",
});

const logEvery = process.env.SECRET_LOG_EVERY ? Number(process.env.SECRET_LOG_EVERY) : 30000
if(logEvery > 0) {
  setInterval(() => {
    console.log({message: 'test', param1: 'test', ts: new Date()})
  }, logEvery)
} else  {
  console.log({message: 'log every disabled', level: 'warn' })
}

// Add all event handlers
for (let i = 0; i < eventHandlers.length; i++) {
  const handler = eventHandlers[i];
  console.log(`Adding event handler [${handler.name}]`);
  processor.addEventHandler(handler.name, handler.callback);
}

// Add all extrinsic handlers
for (let i = 0; i < extrinsicHandlers.length; i++) {
  const handler = extrinsicHandlers[i];
  console.log(`Adding extrinsic handler [${handler.name}]`);
  processor.addExtrinsicHandler(handler.name, handler.callback);
}

processor.run();
