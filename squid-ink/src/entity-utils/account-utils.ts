import { SubstrateBlock } from "@subsquid/substrate-processor";
import {
  NormalisedBalancesAccountStorage,
  NormalisedSystemAccountStorage,
} from "@chain/normalised-types";
import { Store } from "@subsquid/typeorm-store";
import { Ctx } from "../handlers/types";
import { Account, Balance } from "../model";

export async function updateAccountBalance(
  ctx: Ctx,
  id: string,
  block: SubstrateBlock
): Promise<Account> {
  const account = await getOrCreateAccount(ctx.store, id);
  account.balance = await getBalances(ctx, id, block);
  return account;
}

/**
 * Tries to get an account by id in the database.
 * If account doesn't exist, create a fresh one and save in store.
 * @param store
 * @param id
 * @returns Account promise
 */
export async function getOrCreateAccount(
  store: Store,
  id: string
): Promise<Account> {
  let account = await store.get(Account, {
    where: { id },
  });
  if (account == null) {
    account = createAccount(id, new Date());
    await store.save(account);
  }
  return account;
}

/**
 * Creates and returns a new Account object.
 * New account is not saved in store.
 * When called from SystemNewAccountEventHandler, createdAt is the timestamp of the block
 * When called from getOrCreateAccount(), createdAt is the current timestamp
 * because we don't have a way to find out real createdAt timestamp on the chain
 * @param id address of the account
 * @param createdAt timestamp when account is created
 * @returns Account
 */
export function createAccount(id: string, createdAt: Date): Account {
  return new Account({ id, createdAt });
}

async function getBalances(
  ctx: Ctx,
  address: string,
  block: SubstrateBlock
): Promise<Balance> {
  const balancesStorage = process.env.BALANCES_STORE;
  if (!balancesStorage) {
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
