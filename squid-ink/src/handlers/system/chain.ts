import { Ctx } from "handlers/types";
import { ChainProperties, Token } from "../../model";
import { name, ss58Format, token } from "../../chain-config";

export async function handleChainPropertiesUpload<P>(
  ctx: Ctx<P>
): Promise<void> {
  const { store, log } = ctx;
  try {
    const storedChainProps = await ctx.store.get(
      ChainProperties,
      "chain_properties"
    );

    if (storedChainProps) {
      log.info(
        { chain: storedChainProps },
        "Chain properties already uploaded, skipping storage..."
      );
      return;
    }

    log.info({ name, ss58Format, token }, "Storing chain properties...");

    const tokenEntity = new Token({
      id: "0",
      tokenDecimals: token.tokenDecimals,
      tokenSymbol: token.tokenSymbol,
    });
    const chainPropertiesEntity = new ChainProperties({
      id: "chain_properties",
      name,
      token: tokenEntity,
      ss58Format,
    });
    await store.save(tokenEntity);
    await store.save(chainPropertiesEntity);
  } catch (error) {
    log.error(<Error>error, "Error saving chain properties and token config!");
  }
}
