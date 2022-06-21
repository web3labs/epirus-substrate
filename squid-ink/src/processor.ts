import "./initialise";
import {
  BlockHandlerContext,
  EventHandlerContext,
  ExtrinsicHandlerContext,
  SubstrateProcessor,
} from "@subsquid/substrate-processor";
import { createLogger, transports, format, Logger } from "winston";
import {
  eventHandlers,
  extrinsicHandlers,
  blockPreHookHandlers,
} from "./handlers";

const { combine, splat, colorize, printf, timestamp: ts } = format;
const winstonLogger = createLogger({
  transports: [new transports.Console()],
  format: combine(
    colorize(),
    splat(),
    ts(),
    printf(({ level, message, timestamp }) => {
      return `[${timestamp as string}] ${level}: ${message}`;
    })
  ),
});

const processor = new SubstrateProcessor(
  process.env.PROCESSOR_NAME || "contracts_poc"
);

processor.setBatchSize(500);
processor.setDataSource({
  archive: process.env.ARCHIVE_ENDPOINT || "http://localhost:4010/v1/graphql",
  chain: process.env.WS_ENDPOINT || "ws://127.0.0.1:9944",
});
if (process.env.BUNDLE_TYPES) {
  winstonLogger.info(
    "Adding types bundle from file: %s",
    process.env.BUNDLE_TYPES
  );
  processor.setTypesBundle(process.env.BUNDLE_TYPES);
}

winstonLogger.info(
  "Substrate processor [%s] for chain [%s] initialised",
  process.env.PROCESSOR_NAME,
  process.env.CHAIN
);

interface LoggedHandler<ContextType> {
  (ctx: ContextType, logger: Logger): Promise<void>;
}
function curry<ContextType>(
  targetFn: LoggedHandler<ContextType>,
  logger: Logger
) {
  return async (ctx: ContextType) => {
    return targetFn(ctx, logger);
  };
}

// Add block pre-hooks
for (let i = 0; i < blockPreHookHandlers.length; i += 1) {
  const handler = blockPreHookHandlers[i];

  winstonLogger.info("Adding block pre-hook handler [%s]", handler.name);
  const curried = curry<BlockHandlerContext>(handler.callback, winstonLogger);
  processor.addPreHook({ range: { from: 0, to: 0 } }, curried);
}

// Add all event handlers
for (let i = 0; i < eventHandlers.length; i += 1) {
  const handler = eventHandlers[i];

  winstonLogger.info("Adding event handler [%s]", handler.name);
  const curried = curry<EventHandlerContext>(handler.callback, winstonLogger);
  processor.addEventHandler(handler.name, curried);
}

// Add all extrinsic handlers
for (let i = 0; i < extrinsicHandlers.length; i += 1) {
  const handler = extrinsicHandlers[i];
  winstonLogger.info("Adding extrinsic handler [%s]", handler.name);
  const curried = curry<ExtrinsicHandlerContext>(
    handler.callback,
    winstonLogger
  );
  processor.addExtrinsicHandler(handler.name, curried);
}

processor.run();
