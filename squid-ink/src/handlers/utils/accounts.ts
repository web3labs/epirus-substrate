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

  const balancesStorage = process.env.BALANCES_STORE;
  switch (balancesStorage) {
    case "system": {
      const accountStorage = await new NormalisedSystemAccountStorage(
        ctx,
        block
      ).get(id);
      const { free, reserved, miscFrozen, feeFrozen } = accountStorage.data;
      account.balance = new Balance({ free, reserved, miscFrozen, feeFrozen });
      break;
    }
    case "balances": {
      const { free, reserved, miscFrozen, feeFrozen } =
        await new NormalisedBalancesAccountStorage(ctx, block).get(id);
      account.balance = new Balance({ free, reserved, miscFrozen, feeFrozen });
      break;
    }
    case undefined:
      throw new Error("BALANCES_STORE is not defined in .env");
    default:
      ctx.log.warn({ balancesStorage }, "Storage type not supported.");
  }

  return account;
}

/**
 * Tries to get an account by id in the database.
 * If account doesn't exist, return a fresh one.
 * @param store - Store
 * @param id - ID of account
 * @param block - New account will have createdAt = block timestamp
 * @returns Account promise
 */
export async function getOrCreateAccount(
  store: Store,
  id: string,
  block: SubstrateBlock
): Promise<Account> {
  let account = await store.get(Account, id);
  if (account == null) {
    account = new Account({ id, createdAt: new Date(block.timestamp) });
  }
  return account;
}
