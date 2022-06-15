import { BlockHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { CHAIN, TOKEN } from "../chain-properties";
import { ChainProperties, Token } from "../model";

export async function genesisBlockHandler(
  ctx: BlockHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Storing chain properties...");
  const { store } = ctx;
  const tokenEntity = new Token({
    id: "0",
    tokenDecimals: TOKEN.tokenDecimals,
    tokenSymbol: TOKEN.tokenSymbol,
  });

  try {
    await store.save([
      tokenEntity,
      new ChainProperties({
        id: "chain_properties",
        name: CHAIN.name,
        token: tokenEntity,
        ss58Format: CHAIN.ss58Format,
        balancesStorage: CHAIN.balancesStorage,
      }),
    ]);
  } catch (error) {
    logger.error("Error saving chain properties and token config!");
  }
}
