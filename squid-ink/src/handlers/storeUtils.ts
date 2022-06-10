import { Store } from "@subsquid/substrate-processor";
import { Account, Balance } from "../model";


export async function getOrCreateAccount(
  store: Store,
  id: string,
  balance?: Balance
): Promise<Account> {
  let account = await getOrCreate(store, Account, id);
  if (balance != undefined) {
    account.balance = balance;
  }
  return account;
}

export async function getOrCreate<T extends { id: string }>(
  store: Store,
  EntityConstructor: EntityConstructor<T>,
  id: string
): Promise<T> {
  let entity = await store.get<T>(EntityConstructor, {
    where: { id },
  });

  if (entity == null) {
    entity = new EntityConstructor();
    entity.id = id;
  }

  return entity;
}

type EntityConstructor<T> = {
  new (...args: any[]): T;
};