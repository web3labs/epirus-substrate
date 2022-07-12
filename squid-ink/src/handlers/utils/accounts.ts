import { decodeHex, SubstrateBlock } from "@subsquid/substrate-processor";
import * as ss58 from "@subsquid/ss58";
import {
  NormalisedBalancesAccountStorage,
  NormalisedSystemAccountStorage,
} from "@chain/normalised-types";
import { Store } from "@subsquid/typeorm-store";
import { ss58Format } from "../../chain-config";
import { Ctx } from "../types";
import { Account, Balance } from "../../model";

export function encodeAddress(address: Uint8Array | string): string {
  let add: Uint8Array;
  if (typeof address === "string") {
    add = decodeHex(address);
  } else {
    add = address;
  }
  return ss58.codec(ss58Format).encode(add);
}

export async function updateAccountBalance(
  ctx: Ctx,
  id: string,
  block: SubstrateBlock
): Promise<Account> {
  const account = await getOrCreateAccount(ctx.store, id, block);
  account.balance = await getBalances(ctx, id, block);
  return account;
}

/**
 * Tries to get an account by id in the database.
 * If account doesn't exist, return a fresh one.
 * @param store - Store
 * @param id - ID of account
 * @param block - New account will have createdAt field = block timestamp
 * @returns Account promise
 */
export async function getOrCreateAccount(
  store: Store,
  id: string,
  block: SubstrateBlock
): Promise<Account> {
  let account = await store.get(Account, id);
  if (account == null) {
    account = createAccount(id, new Date(block.timestamp));
  }
  return account;
}

/**
 * Creates and returns a new Account object.
 * @param id address of the account
 * @param createdAt timestamp when account is created
 * @returns Account
 */
function createAccount(id: string, createdAt: Date): Account {
  return new Account({ id, createdAt });
}

async function getBalances(
  ctx: Ctx,
  address: string,
  block: SubstrateBlock
): Promise<Balance> {
  const balancesStorage = process.env.BALANCES_STORE;
  if (balancesStorage === undefined) {
    throw new Error("BALANCES_STORE is not defined in .env");
  }
  if (balancesStorage === "system") {
    const accountStorage = await new NormalisedSystemAccountStorage(
      ctx,
      block
    ).get(address);
    const { free, reserved, miscFrozen, feeFrozen } = accountStorage.data;
    return new Balance({ free, reserved, miscFrozen, feeFrozen });
  }
  if (balancesStorage === "balances") {
    const { free, reserved, miscFrozen, feeFrozen } =
      await new NormalisedBalancesAccountStorage(ctx, block).get(address);
    return new Balance({ free, reserved, miscFrozen, feeFrozen });
  }
  throw new Error(
    `Type of balances storage [${balancesStorage}] not supported!`
  );
}
