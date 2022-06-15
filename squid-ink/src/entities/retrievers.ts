import { Store } from "@subsquid/substrate-processor";
import { Account, Balance } from "../model";

export async function updateAccount(
  store: Store,
  id: string,
  balance?: Balance,
  tags?: string[]
): Promise<Account> {
  const account = await getAccount(store, id);
  if (balance) {
    if (account.balance) {
      account.balance = new Balance({ ...account.balance, ...balance });
    } else {
      account.balance = balance;
    }
  }
  if (tags) {
    if (account.tags) {
      account.tags = account.tags.concat(tags);
    } else {
      account.tags = tags;
    }
  }
  return account;
}

export async function getAccount(store: Store, id: string): Promise<Account> {
  let account = await store.get(Account, {
    where: { id },
  });
  if (account == null) {
    account = new Account({ id });
  }
  return account;
}
