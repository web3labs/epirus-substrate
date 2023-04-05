import { assertNotNull } from "@subsquid/substrate-processor";
import { Ctx } from "./handlers/types";
import { ChainProperties, Token } from "./model";

export interface ChainConfig {
  name: string;
  ss58Format: number;
  token: {
    tokenDecimals: number;
    tokenSymbol: string;
  };
}

const chainConfig: Record<string, ChainConfig> = {
  local: {
    name: "Local Contracts Chain",
    ss58Format: 42,
    token: {
      tokenDecimals: 12,
      tokenSymbol: "Unit",
    },
  },
  rococo: {
    name: "Contracts on Rococo",
    ss58Format: 42,
    token: {
      tokenDecimals: 12,
      tokenSymbol: "ROC",
    },
  },
  shibuya: {
    name: "Shibuya Testnet",
    ss58Format: 5,
    token: {
      tokenDecimals: 18,
      tokenSymbol: "SBY",
    },
  },
  watr: {
    name: "Watr Network",
    ss58Format: 19,
    token: {
      tokenDecimals: 18,
      tokenSymbol: "WATRD",
    },
  },
  alephzero: {
    name: "Aleph Zero",
    ss58Format: 5,
    token: {
      tokenDecimals: 9,
      tokenSymbol: "AZERO",
    },
  },
};

function getChainConfig(): ChainConfig {
  const chain = assertNotNull(
    process.env.CHAIN,
    "Please set CHAIN variable in .env file"
  );
  return chainConfig[chain];
}

const config = getChainConfig();
export const { name, ss58Format, token } = config;

export class ChainPropertiesStore {
  private stored = false;

  async save(ctx: Ctx): Promise<void> {
    if (this.stored) {
      return;
    }
    try {
      await this._save(ctx);
      this.stored = true;
    } catch (error) {
      ctx.log.error(
        <Error>error,
        "Error saving chain properties and token config!"
      );
    }
  }

  private async _save(ctx: Ctx): Promise<void> {
    const { log, store } = ctx;
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
  }
}
