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
  }
  return account;
}

/**
 * Creates and returns a new Account object.
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
