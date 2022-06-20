import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v27 from './v27'
import * as v31 from './v31'

export class BalancesDepositEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Deposit')
  }

  /**
   *  Some amount was deposited (e.g. for transaction fees). \[who, deposit\]
   */
  get isV1(): boolean {
    return this.ctx._chain.getEventHash('balances.Deposit') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  Some amount was deposited (e.g. for transaction fees). \[who, deposit\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get isV27(): boolean {
    return this.ctx._chain.getEventHash('balances.Deposit') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get asV27(): {who: v27.AccountId32, amount: bigint} {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV27
  }

  get asLatest(): {who: v27.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV27
  }
}

export class BalancesEndowedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Endowed')
  }

  /**
   *  An account was created with some free balance. \[account, free_balance\]
   */
  get isV1(): boolean {
    return this.ctx._chain.getEventHash('balances.Endowed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  An account was created with some free balance. \[account, free_balance\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * An account was created with some free balance.
   */
  get isV27(): boolean {
    return this.ctx._chain.getEventHash('balances.Endowed') === '75951f685df19cbb5fdda09cf928a105518ceca9576d95bd18d4fac8802730ca'
  }

  /**
   * An account was created with some free balance.
   */
  get asV27(): {account: v27.AccountId32, freeBalance: bigint} {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV27
  }

  get asLatest(): {account: v27.AccountId32, freeBalance: bigint} {
    deprecateLatest()
    return this.asV27
  }
}

export class BalancesReservedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Reserved')
  }

  /**
   *  Some balance was reserved (moved from free to reserved). \[who, value\]
   */
  get isV1(): boolean {
    return this.ctx._chain.getEventHash('balances.Reserved') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
  }

  /**
   *  Some balance was reserved (moved from free to reserved). \[who, value\]
   */
  get asV1(): [Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get isV27(): boolean {
    return this.ctx._chain.getEventHash('balances.Reserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get asV27(): {who: v27.AccountId32, amount: bigint} {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV27
  }

  get asLatest(): {who: v27.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV27
  }
}

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   *  Transfer succeeded. \[from, to, value\]
   */
  get isV1(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === 'dad2bcdca357505fa3c7832085d0db53ce6f902bd9f5b52823ee8791d351872c'
  }

  /**
   *  Transfer succeeded. \[from, to, value\]
   */
  get asV1(): [Uint8Array, Uint8Array, bigint] {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * Transfer succeeded.
   */
  get isV27(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
  }

  /**
   * Transfer succeeded.
   */
  get asV27(): {from: v27.AccountId32, to: v27.AccountId32, amount: bigint} {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV27
  }

  get asLatest(): {from: v27.AccountId32, to: v27.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV27
  }
}

export class BalancesWithdrawEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Withdraw')
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get isV27(): boolean {
    return this.ctx._chain.getEventHash('balances.Withdraw') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get asV27(): {who: v27.AccountId32, amount: bigint} {
    assert(this.isV27)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV27
  }

  get asLatest(): {who: v27.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV27
  }
}

export class ContractsCodeStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'contracts.CodeStored')
  }

  /**
   * Code with the specified hash has been stored.
   */
  get isV31(): boolean {
    return this.ctx._chain.getEventHash('contracts.CodeStored') === '9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d'
  }

  /**
   * Code with the specified hash has been stored.
   */
  get asV31(): {codeHash: v31.H256} {
    assert(this.isV31)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV31
  }

  get asLatest(): {codeHash: v31.H256} {
    deprecateLatest()
    return this.asV31
  }
}

export class ContractsContractEmittedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'contracts.ContractEmitted')
  }

  /**
   * A custom event emitted by the contract.
   */
  get isV31(): boolean {
    return this.ctx._chain.getEventHash('contracts.ContractEmitted') === '7f28393268795b9a97f05e82911cdcc4200d99e9968c1ab6a564f949f753b929'
  }

  /**
   * A custom event emitted by the contract.
   */
  get asV31(): {contract: v31.AccountId32, data: Uint8Array} {
    assert(this.isV31)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV31
  }

  get asLatest(): {contract: v31.AccountId32, data: Uint8Array} {
    deprecateLatest()
    return this.asV31
  }
}

export class ContractsInstantiatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'contracts.Instantiated')
  }

  /**
   * Contract deployed by address at the specified address.
   */
  get isV31(): boolean {
    return this.ctx._chain.getEventHash('contracts.Instantiated') === '20f9f9057a4149f58eb48c00359f9800a42b51d4d2168437dfcce668c27a8d37'
  }

  /**
   * Contract deployed by address at the specified address.
   */
  get asV31(): {deployer: v31.AccountId32, contract: v31.AccountId32} {
    assert(this.isV31)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV31
  }

  get asLatest(): {deployer: v31.AccountId32, contract: v31.AccountId32} {
    deprecateLatest()
    return this.asV31
  }
}

export class SystemNewAccountEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'system.NewAccount')
  }

  /**
   *  A new \[account\] was created.
   */
  get isV1(): boolean {
    return this.ctx._chain.getEventHash('system.NewAccount') === '21ea0c8f2488eafafdea1de92b54cd17d8b1caff525e37616abf0ff93f11531d'
  }

  /**
   *  A new \[account\] was created.
   */
  get asV1(): Uint8Array {
    assert(this.isV1)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  /**
   * A new account was created.
   */
  get isV31(): boolean {
    return this.ctx._chain.getEventHash('system.NewAccount') === '7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92'
  }

  /**
   * A new account was created.
   */
  get asV31(): {account: v31.AccountId32} {
    assert(this.isV31)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV31
  }

  get asLatest(): {account: v31.AccountId32} {
    deprecateLatest()
    return this.asV31
  }
}
