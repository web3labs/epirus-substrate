import { assertNotNull } from "@subsquid/substrate-processor";

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
