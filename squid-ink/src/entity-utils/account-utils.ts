import { EventHandlerContext, Store } from "@subsquid/substrate-processor";
import {
  NormalisedBalancesAccountStorage,
  NormalisedSystemAccountStorage,
} from "@chain/normalised-types";
import { Account, Balance } from "../model";

export async function updateAccountBalance(
  ctx: EventHandlerContext,
  id: string
): Promise<Account> {
  const account = await getOrCreateAccount(ctx.store, id);
  account.balance = await getBalances(ctx, id);
  return account;
}

/**
 * Tries to get an account by id in the database.
 * If account doesn't exist, return a fresh one.
 * @param store
 * @param id
 * @returns
 */
export async function getOrCreateAccount(
  store: Store,
  id: string
): Promise<Account> {
  let account = await store.get(Account, {
    where: { id },
  });
  if (account == null) {
    account = new Account({ id });
  }
  return account;
}

/**
 * Tries to get an account by id in the database.
 * If account doesn't exist, throw an error.
 * To be used when we don't want a new account created if it cannot be found.
 * @param store
 * @param id
 * @returns
 */
export async function getAccount(store: Store, id: string): Promise<Account> {
  const account = await store.get(Account, {
    where: { id },
  });
  if (account == null) {
    throw new Error(`No account found for ID [${id}]`);
  }
  return account;
}

async function getBalances(
  ctx: EventHandlerContext,
  address: string
): Promise<Balance> {
  const balancesStorage = process.env.BALANCES_STORE;
  if (!balancesStorage) {
    throw new Error("BALANCES_STORE is not defined in .env");
  }
  if (balancesStorage === "system") {
    const accountStorage = await new NormalisedSystemAccountStorage(ctx).get(
      address
    );
    const { free, reserved, miscFrozen, feeFrozen } = accountStorage.data;
    return new Balance({ free, reserved, miscFrozen, feeFrozen });
  }
  if (balancesStorage === "balances") {
    const { free, reserved, miscFrozen, feeFrozen } =
      await new NormalisedBalancesAccountStorage(ctx).get(address);
    return new Balance({ free, reserved, miscFrozen, feeFrozen });
  }
  throw new Error(
    `Type of balances storage [${balancesStorage}] not supported!`
  );
}
