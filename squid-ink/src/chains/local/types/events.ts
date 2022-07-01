import assert from 'assert'
import {EventContext, Result, deprecateLatest} from './support'
import * as v100 from './v100'

export class BalancesDepositEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Deposit')
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('balances.Deposit') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get asV100(): {who: v100.AccountId32, amount: bigint} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {who: v100.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV100
  }
}

export class BalancesEndowedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Endowed')
  }

  /**
   * An account was created with some free balance.
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('balances.Endowed') === '75951f685df19cbb5fdda09cf928a105518ceca9576d95bd18d4fac8802730ca'
  }

  /**
   * An account was created with some free balance.
   */
  get asV100(): {account: v100.AccountId32, freeBalance: bigint} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {account: v100.AccountId32, freeBalance: bigint} {
    deprecateLatest()
    return this.asV100
  }
}

export class BalancesReservedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Reserved')
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('balances.Reserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get asV100(): {who: v100.AccountId32, amount: bigint} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {who: v100.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV100
  }
}

export class BalancesTransferEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Transfer')
  }

  /**
   * Transfer succeeded.
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
  }

  /**
   * Transfer succeeded.
   */
  get asV100(): {from: v100.AccountId32, to: v100.AccountId32, amount: bigint} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {from: v100.AccountId32, to: v100.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV100
  }
}

export class BalancesWithdrawEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'balances.Withdraw')
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('balances.Withdraw') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get asV100(): {who: v100.AccountId32, amount: bigint} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {who: v100.AccountId32, amount: bigint} {
    deprecateLatest()
    return this.asV100
  }
}

export class ContractsCodeRemovedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'contracts.CodeRemoved')
  }

  /**
   * A code with the specified hash was removed.
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('contracts.CodeRemoved') === '9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d'
  }

  /**
   * A code with the specified hash was removed.
   */
  get asV100(): {codeHash: v100.H256} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {codeHash: v100.H256} {
    deprecateLatest()
    return this.asV100
  }
}

export class ContractsCodeStoredEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'contracts.CodeStored')
  }

  /**
   * Code with the specified hash has been stored.
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('contracts.CodeStored') === '9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d'
  }

  /**
   * Code with the specified hash has been stored.
   */
  get asV100(): {codeHash: v100.H256} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {codeHash: v100.H256} {
    deprecateLatest()
    return this.asV100
  }
}

export class ContractsContractCodeUpdatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'contracts.ContractCodeUpdated')
  }

  /**
   * A contract's code was updated.
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('contracts.ContractCodeUpdated') === 'f9de6decda4961d31d7cf59e3f8acd4849a220323ebabbb036464d999de54c18'
  }

  /**
   * A contract's code was updated.
   */
  get asV100(): {contract: v100.AccountId32, newCodeHash: v100.H256, oldCodeHash: v100.H256} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {contract: v100.AccountId32, newCodeHash: v100.H256, oldCodeHash: v100.H256} {
    deprecateLatest()
    return this.asV100
  }
}

export class ContractsContractEmittedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'contracts.ContractEmitted')
  }

  /**
   * A custom event emitted by the contract.
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('contracts.ContractEmitted') === '7f28393268795b9a97f05e82911cdcc4200d99e9968c1ab6a564f949f753b929'
  }

  /**
   * A custom event emitted by the contract.
   */
  get asV100(): {contract: v100.AccountId32, data: Uint8Array} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {contract: v100.AccountId32, data: Uint8Array} {
    deprecateLatest()
    return this.asV100
  }
}

export class ContractsInstantiatedEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'contracts.Instantiated')
  }

  /**
   * Contract deployed by address at the specified address.
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('contracts.Instantiated') === '20f9f9057a4149f58eb48c00359f9800a42b51d4d2168437dfcce668c27a8d37'
  }

  /**
   * Contract deployed by address at the specified address.
   */
  get asV100(): {deployer: v100.AccountId32, contract: v100.AccountId32} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {deployer: v100.AccountId32, contract: v100.AccountId32} {
    deprecateLatest()
    return this.asV100
  }
}

export class SystemNewAccountEvent {
  constructor(private ctx: EventContext) {
    assert(this.ctx.event.name === 'system.NewAccount')
  }

  /**
   * A new account was created.
   */
  get isV100(): boolean {
    return this.ctx._chain.getEventHash('system.NewAccount') === '7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92'
  }

  /**
   * A new account was created.
   */
  get asV100(): {account: v100.AccountId32} {
    assert(this.isV100)
    return this.ctx._chain.decodeEvent(this.ctx.event)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {account: v100.AccountId32} {
    deprecateLatest()
    return this.asV100
  }
}
