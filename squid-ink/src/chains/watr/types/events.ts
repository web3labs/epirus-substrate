import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'

export class BalancesEndowedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Endowed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An account was created with some free balance.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Balances.Endowed') === '75951f685df19cbb5fdda09cf928a105518ceca9576d95bd18d4fac8802730ca'
    }

    /**
     * An account was created with some free balance.
     */
    get asWatrNodeV1000(): {account: Uint8Array, freeBalance: bigint} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesReservedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Reserved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some balance was reserved (moved from free to reserved).
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Balances.Reserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    }

    /**
     * Some balance was reserved (moved from free to reserved).
     */
    get asWatrNodeV1000(): {who: Uint8Array, amount: bigint} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesTransferEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Transfer')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Transfer succeeded.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
    }

    /**
     * Transfer succeeded.
     */
    get asWatrNodeV1000(): {from: Uint8Array, to: Uint8Array, amount: bigint} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesWithdrawEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Withdraw')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Balances.Withdraw') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    }

    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    get asWatrNodeV1000(): {who: Uint8Array, amount: bigint} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContractsCodeRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Contracts.CodeRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A code with the specified hash was removed.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Contracts.CodeRemoved') === '9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d'
    }

    /**
     * A code with the specified hash was removed.
     */
    get asWatrNodeV1000(): {codeHash: Uint8Array} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContractsCodeStoredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Contracts.CodeStored')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Code with the specified hash has been stored.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Contracts.CodeStored') === '9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d'
    }

    /**
     * Code with the specified hash has been stored.
     */
    get asWatrNodeV1000(): {codeHash: Uint8Array} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContractsContractCodeUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Contracts.ContractCodeUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A contract's code was updated.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Contracts.ContractCodeUpdated') === 'f9de6decda4961d31d7cf59e3f8acd4849a220323ebabbb036464d999de54c18'
    }

    /**
     * A contract's code was updated.
     */
    get asWatrNodeV1000(): {contract: Uint8Array, newCodeHash: Uint8Array, oldCodeHash: Uint8Array} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContractsContractEmittedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Contracts.ContractEmitted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A custom event emitted by the contract.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Contracts.ContractEmitted') === '7f28393268795b9a97f05e82911cdcc4200d99e9968c1ab6a564f949f753b929'
    }

    /**
     * A custom event emitted by the contract.
     */
    get asWatrNodeV1000(): {contract: Uint8Array, data: Uint8Array} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContractsInstantiatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Contracts.Instantiated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Contract deployed by address at the specified address.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Contracts.Instantiated') === '20f9f9057a4149f58eb48c00359f9800a42b51d4d2168437dfcce668c27a8d37'
    }

    /**
     * Contract deployed by address at the specified address.
     */
    get asWatrNodeV1000(): {deployer: Uint8Array, contract: Uint8Array} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class ContractsTerminatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Contracts.Terminated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Contract has been removed.
     * 
     * # Note
     * 
     * The only way for a contract to be removed and emitting this event is by calling
     * `seal_terminate`.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('Contracts.Terminated') === '8e0b376b4821223ecd835a0ae76a615e7aa14158260ff9c7f87220449d98175b'
    }

    /**
     * Contract has been removed.
     * 
     * # Note
     * 
     * The only way for a contract to be removed and emitting this event is by calling
     * `seal_terminate`.
     */
    get asWatrNodeV1000(): {contract: Uint8Array, beneficiary: Uint8Array} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}

export class SystemNewAccountEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'System.NewAccount')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new account was created.
     */
    get isWatrNodeV1000(): boolean {
        return this._chain.getEventHash('System.NewAccount') === '7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92'
    }

    /**
     * A new account was created.
     */
    get asWatrNodeV1000(): {account: Uint8Array} {
        assert(this.isWatrNodeV1000)
        return this._chain.decodeEvent(this.event)
    }
}
