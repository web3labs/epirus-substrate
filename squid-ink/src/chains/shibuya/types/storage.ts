import assert from 'assert'
import {StorageContext, Result} from './support'
import * as v1 from './v1'
import * as v31 from './v31'

export class BalancesAccountStorage {
  constructor(private ctx: StorageContext) {}

  /**
   *  The balance of an account.
   * 
   *  NOTE: This is only used in the case that this pallet is used to store balances.
   */
  get isV1() {
    return this.ctx._chain.getStorageItemTypeHash('Balances', 'Account') === '0b3b4bf0dd7388459eba461bc7c3226bf58608c941710a714e02f33ec0f91e78'
  }

  /**
   *  The balance of an account.
   * 
   *  NOTE: This is only used in the case that this pallet is used to store balances.
   */
  async getAsV1(key: Uint8Array): Promise<v1.AccountData> {
    assert(this.isV1)
    return this.ctx._chain.getStorage(this.ctx.block.hash, 'Balances', 'Account', key)
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this.ctx._chain.getStorageItemTypeHash('Balances', 'Account') != null
  }
}

export class ContractsCodeStorageStorage {
  constructor(private ctx: StorageContext) {}

  /**
   *  A mapping between an original code hash and instrumented wasm code, ready for execution.
   */
  get isV31() {
    return this.ctx._chain.getStorageItemTypeHash('Contracts', 'CodeStorage') === '1d41f869264eec7411828c1a845cdbad1a39455691f254f6bfead6b3102145ab'
  }

  /**
   *  A mapping between an original code hash and instrumented wasm code, ready for execution.
   */
  async getAsV31(key: v31.H256): Promise<v31.PrefabWasmModule | undefined> {
    assert(this.isV31)
    return this.ctx._chain.getStorage(this.ctx.block.hash, 'Contracts', 'CodeStorage', key)
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this.ctx._chain.getStorageItemTypeHash('Contracts', 'CodeStorage') != null
  }
}

export class ContractsContractInfoOfStorage {
  constructor(private ctx: StorageContext) {}

  /**
   *  The code associated with a given account.
   * 
   *  TWOX-NOTE: SAFE since `AccountId` is a secure hash.
   */
  get isV31() {
    return this.ctx._chain.getStorageItemTypeHash('Contracts', 'ContractInfoOf') === 'ca1ad2ae4b550883411d45c2158af4f3e2a0bde306e44674a586527ce222bcf3'
  }

  /**
   *  The code associated with a given account.
   * 
   *  TWOX-NOTE: SAFE since `AccountId` is a secure hash.
   */
  async getAsV31(key: v31.AccountId32): Promise<v31.RawContractInfo | undefined> {
    assert(this.isV31)
    return this.ctx._chain.getStorage(this.ctx.block.hash, 'Contracts', 'ContractInfoOf', key)
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this.ctx._chain.getStorageItemTypeHash('Contracts', 'ContractInfoOf') != null
  }
}

export class ContractsOwnerInfoOfStorage {
  constructor(private ctx: StorageContext) {}

  /**
   *  A mapping between an original code hash and its owner information.
   */
  get isV31() {
    return this.ctx._chain.getStorageItemTypeHash('Contracts', 'OwnerInfoOf') === '76689686c73821ee740f33d092a38a05de83a2833f6c8857baa886203c5bf939'
  }

  /**
   *  A mapping between an original code hash and its owner information.
   */
  async getAsV31(key: v31.H256): Promise<v31.OwnerInfo | undefined> {
    assert(this.isV31)
    return this.ctx._chain.getStorage(this.ctx.block.hash, 'Contracts', 'OwnerInfoOf', key)
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this.ctx._chain.getStorageItemTypeHash('Contracts', 'OwnerInfoOf') != null
  }
}

export class SystemAccountStorage {
  constructor(private ctx: StorageContext) {}

  /**
   *  The full account information for a particular account ID.
   */
  get isV1() {
    return this.ctx._chain.getStorageItemTypeHash('System', 'Account') === '1ddc7ade926221442c388ee4405a71c9428e548fab037445aaf4b3a78f4735c1'
  }

  /**
   *  The full account information for a particular account ID.
   */
  async getAsV1(key: Uint8Array): Promise<v1.AccountInfoWithTripleRefCount> {
    assert(this.isV1)
    return this.ctx._chain.getStorage(this.ctx.block.hash, 'System', 'Account', key)
  }

  /**
   * Checks whether the storage item is defined for the current chain version.
   */
  get isExists(): boolean {
    return this.ctx._chain.getStorageItemTypeHash('System', 'Account') != null
  }
}
