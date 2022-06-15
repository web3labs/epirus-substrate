import {
  EventHandlerContext,
  ExtrinsicHandlerContext,
  SubstrateProcessor,
} from "@subsquid/substrate-processor";
import { createLogger, transports, format, Logger } from "winston";
import { eventHandlers, extrinsicHandlers } from "./handlers";

// TO DO: Extract to config file
const processor = new SubstrateProcessor("contracts_poc");

processor.setBatchSize(500);
// processor.setBlockRange({ from: 0 });
processor.setDataSource({
  archive: "http://localhost:4010/v1/graphql",
  chain: "ws://127.0.0.1:9944",
});

const { combine, splat, colorize, printf, timestamp: ts } = format;
const winstonLogger = createLogger({
  transports: [
    new transports.File({ filename: "error.log", level: "error" }),
    new transports.File({ filename: "combined.log" }),
  ],
  format: combine(
    colorize(),
    splat(),
    ts(),
    printf(({ level, message, timestamp }) => {
      return `[${timestamp as string}] ${level}: ${message}`;
    })
  ),
});

if (process.env.NODE_ENV !== "production") {
  winstonLogger.add(new transports.Console());
  winstonLogger.level = "debug";
}

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
