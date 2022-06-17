import { BlockHandlerContext } from "@subsquid/substrate-processor";
import { Logger } from "winston";
import { name, ss58Format, token } from "../chain-config";
import { ChainProperties, Token } from "../model";

export async function genesisBlockHandler(
  ctx: BlockHandlerContext,
  logger: Logger
): Promise<void> {
  logger.info("Storing chain properties...");
  const { store } = ctx;
  const tokenEntity = new Token({
    id: "0",
    tokenDecimals: token.tokenDecimals,
    tokenSymbol: token.tokenSymbol,
  });

  try {
    await store.save([
      tokenEntity,
      new ChainProperties({
        id: "chain_properties",
        name,
        token: tokenEntity,
        ss58Format,
      }),
    ]);
  } catch (error) {
    logger.error("Error saving chain properties and token config!");
  }
}
