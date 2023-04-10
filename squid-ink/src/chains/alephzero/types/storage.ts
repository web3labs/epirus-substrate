import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext} from './support'
import * as v12 from './v12'
import * as v20 from './v20'
import * as v45 from './v45'
import * as v57 from './v57'

export class BalancesAccountStorage {
    private readonly _chain: Chain
    private readonly blockHash: string

    constructor(ctx: BlockContext)
    constructor(ctx: ChainContext, block: Block)
    constructor(ctx: BlockContext, block?: Block) {
        block = block || ctx.block
        this.blockHash = block.hash
        this._chain = ctx._chain
    }

    /**
     *  The balance of an account.
     *
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    get isV12() {
        return this._chain.getStorageItemTypeHash('Balances', 'Account') === '0b3b4bf0dd7388459eba461bc7c3226bf58608c941710a714e02f33ec0f91e78'
    }

    /**
     *  The balance of an account.
     *
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    async getAsV12(key: Uint8Array): Promise<v12.AccountData> {
        assert(this.isV12)
        return this._chain.getStorage(this.blockHash, 'Balances', 'Account', key)
    }

    async getManyAsV12(keys: Uint8Array[]): Promise<(v12.AccountData)[]> {
        assert(this.isV12)
        return this._chain.queryStorage(this.blockHash, 'Balances', 'Account', keys.map(k => [k]))
    }

    async getAllAsV12(): Promise<(v12.AccountData)[]> {
        assert(this.isV12)
        return this._chain.queryStorage(this.blockHash, 'Balances', 'Account')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('Balances', 'Account') != null
    }
}

export class ContractsCodeStorageStorage {
    private readonly _chain: Chain
    private readonly blockHash: string

    constructor(ctx: BlockContext)
    constructor(ctx: ChainContext, block: Block)
    constructor(ctx: BlockContext, block?: Block) {
        block = block || ctx.block
        this.blockHash = block.hash
        this._chain = ctx._chain
    }

    /**
     *  A mapping between an original code hash and instrumented wasm code, ready for execution.
     */
    get isV20() {
        return this._chain.getStorageItemTypeHash('Contracts', 'CodeStorage') === '1d41f869264eec7411828c1a845cdbad1a39455691f254f6bfead6b3102145ab'
    }

    /**
     *  A mapping between an original code hash and instrumented wasm code, ready for execution.
     */
    async getAsV20(key: Uint8Array): Promise<v20.PrefabWasmModule | undefined> {
        assert(this.isV20)
        return this._chain.getStorage(this.blockHash, 'Contracts', 'CodeStorage', key)
    }

    async getManyAsV20(keys: Uint8Array[]): Promise<(v20.PrefabWasmModule | undefined)[]> {
        assert(this.isV20)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'CodeStorage', keys.map(k => [k]))
    }

    async getAllAsV20(): Promise<(v20.PrefabWasmModule)[]> {
        assert(this.isV20)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'CodeStorage')
    }

    /**
     *  A mapping between an original code hash and instrumented wasm code, ready for execution.
     */
    get isV57() {
        return this._chain.getStorageItemTypeHash('Contracts', 'CodeStorage') === 'd90967ccfb2cbaf184f7d41bb1a330beaf15a192d25803d6352047090a9e635e'
    }

    /**
     *  A mapping between an original code hash and instrumented wasm code, ready for execution.
     */
    async getAsV57(key: Uint8Array): Promise<v57.PrefabWasmModule | undefined> {
        assert(this.isV57)
        return this._chain.getStorage(this.blockHash, 'Contracts', 'CodeStorage', key)
    }

    async getManyAsV57(keys: Uint8Array[]): Promise<(v57.PrefabWasmModule | undefined)[]> {
        assert(this.isV57)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'CodeStorage', keys.map(k => [k]))
    }

    async getAllAsV57(): Promise<(v57.PrefabWasmModule)[]> {
        assert(this.isV57)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'CodeStorage')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('Contracts', 'CodeStorage') != null
    }
}

export class ContractsContractInfoOfStorage {
    private readonly _chain: Chain
    private readonly blockHash: string

    constructor(ctx: BlockContext)
    constructor(ctx: ChainContext, block: Block)
    constructor(ctx: BlockContext, block?: Block) {
        block = block || ctx.block
        this.blockHash = block.hash
        this._chain = ctx._chain
    }

    /**
     *  The code associated with a given account.
     *
     *  TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    get isV20() {
        return this._chain.getStorageItemTypeHash('Contracts', 'ContractInfoOf') === 'ca1ad2ae4b550883411d45c2158af4f3e2a0bde306e44674a586527ce222bcf3'
    }

    /**
     *  The code associated with a given account.
     *
     *  TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    async getAsV20(key: Uint8Array): Promise<v20.RawContractInfo | undefined> {
        assert(this.isV20)
        return this._chain.getStorage(this.blockHash, 'Contracts', 'ContractInfoOf', key)
    }

    async getManyAsV20(keys: Uint8Array[]): Promise<(v20.RawContractInfo | undefined)[]> {
        assert(this.isV20)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'ContractInfoOf', keys.map(k => [k]))
    }

    async getAllAsV20(): Promise<(v20.RawContractInfo)[]> {
        assert(this.isV20)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'ContractInfoOf')
    }

    /**
     *  The code associated with a given account.
     *
     *  TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    get isV45() {
        return this._chain.getStorageItemTypeHash('Contracts', 'ContractInfoOf') === 'b19f56551b6001070487b6e33ba3a88bf2e7a48df38a8c979b2d69856127de63'
    }

    /**
     *  The code associated with a given account.
     *
     *  TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    async getAsV45(key: Uint8Array): Promise<v45.ContractInfo | undefined> {
        assert(this.isV45)
        return this._chain.getStorage(this.blockHash, 'Contracts', 'ContractInfoOf', key)
    }

    async getManyAsV45(keys: Uint8Array[]): Promise<(v45.ContractInfo | undefined)[]> {
        assert(this.isV45)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'ContractInfoOf', keys.map(k => [k]))
    }

    async getAllAsV45(): Promise<(v45.ContractInfo)[]> {
        assert(this.isV45)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'ContractInfoOf')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('Contracts', 'ContractInfoOf') != null
    }
}

export class ContractsOwnerInfoOfStorage {
    private readonly _chain: Chain
    private readonly blockHash: string

    constructor(ctx: BlockContext)
    constructor(ctx: ChainContext, block: Block)
    constructor(ctx: BlockContext, block?: Block) {
        block = block || ctx.block
        this.blockHash = block.hash
        this._chain = ctx._chain
    }

    /**
     *  A mapping between an original code hash and its owner information.
     */
    get isV20() {
        return this._chain.getStorageItemTypeHash('Contracts', 'OwnerInfoOf') === '76689686c73821ee740f33d092a38a05de83a2833f6c8857baa886203c5bf939'
    }

    /**
     *  A mapping between an original code hash and its owner information.
     */
    async getAsV20(key: Uint8Array): Promise<v20.OwnerInfo | undefined> {
        assert(this.isV20)
        return this._chain.getStorage(this.blockHash, 'Contracts', 'OwnerInfoOf', key)
    }

    async getManyAsV20(keys: Uint8Array[]): Promise<(v20.OwnerInfo | undefined)[]> {
        assert(this.isV20)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'OwnerInfoOf', keys.map(k => [k]))
    }

    async getAllAsV20(): Promise<(v20.OwnerInfo)[]> {
        assert(this.isV20)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'OwnerInfoOf')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('Contracts', 'OwnerInfoOf') != null
    }
}

export class SystemAccountStorage {
    private readonly _chain: Chain
    private readonly blockHash: string

    constructor(ctx: BlockContext)
    constructor(ctx: ChainContext, block: Block)
    constructor(ctx: BlockContext, block?: Block) {
        block = block || ctx.block
        this.blockHash = block.hash
        this._chain = ctx._chain
    }

    /**
     *  The full account information for a particular account ID.
     */
    get isV12() {
        return this._chain.getStorageItemTypeHash('System', 'Account') === '1ddc7ade926221442c388ee4405a71c9428e548fab037445aaf4b3a78f4735c1'
    }

    /**
     *  The full account information for a particular account ID.
     */
    async getAsV12(key: Uint8Array): Promise<v12.AccountInfo> {
        assert(this.isV12)
        return this._chain.getStorage(this.blockHash, 'System', 'Account', key)
    }

    async getManyAsV12(keys: Uint8Array[]): Promise<(v12.AccountInfo)[]> {
        assert(this.isV12)
        return this._chain.queryStorage(this.blockHash, 'System', 'Account', keys.map(k => [k]))
    }

    async getAllAsV12(): Promise<(v12.AccountInfo)[]> {
        assert(this.isV12)
        return this._chain.queryStorage(this.blockHash, 'System', 'Account')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('System', 'Account') != null
    }
}
