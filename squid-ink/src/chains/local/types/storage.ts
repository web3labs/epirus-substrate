import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result, Option} from './support'
import * as v100 from './v100'

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
     *  The Balances pallet example of storing the balance of an account.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
     *   }
     *  ```
     * 
     *  You can also store the balance of an account in the `System` pallet.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *    type AccountStore = System
     *   }
     *  ```
     * 
     *  But this comes with tradeoffs, storing account balances in the system pallet stores
     *  `frame_system` data alongside the account data contrary to storing account balances in the
     *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    get isV100() {
        return this._chain.getStorageItemTypeHash('Balances', 'Account') === '0b3b4bf0dd7388459eba461bc7c3226bf58608c941710a714e02f33ec0f91e78'
    }

    /**
     *  The Balances pallet example of storing the balance of an account.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
     *   }
     *  ```
     * 
     *  You can also store the balance of an account in the `System` pallet.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *    type AccountStore = System
     *   }
     *  ```
     * 
     *  But this comes with tradeoffs, storing account balances in the system pallet stores
     *  `frame_system` data alongside the account data contrary to storing account balances in the
     *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    async getAsV100(key: Uint8Array): Promise<v100.AccountData> {
        assert(this.isV100)
        return this._chain.getStorage(this.blockHash, 'Balances', 'Account', key)
    }

    async getManyAsV100(keys: Uint8Array[]): Promise<(v100.AccountData)[]> {
        assert(this.isV100)
        return this._chain.queryStorage(this.blockHash, 'Balances', 'Account', keys.map(k => [k]))
    }

    async getAllAsV100(): Promise<(v100.AccountData)[]> {
        assert(this.isV100)
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
    get isV100() {
        return this._chain.getStorageItemTypeHash('Contracts', 'CodeStorage') === 'd90967ccfb2cbaf184f7d41bb1a330beaf15a192d25803d6352047090a9e635e'
    }

    /**
     *  A mapping between an original code hash and instrumented wasm code, ready for execution.
     */
    async getAsV100(key: Uint8Array): Promise<v100.PrefabWasmModule | undefined> {
        assert(this.isV100)
        return this._chain.getStorage(this.blockHash, 'Contracts', 'CodeStorage', key)
    }

    async getManyAsV100(keys: Uint8Array[]): Promise<(v100.PrefabWasmModule | undefined)[]> {
        assert(this.isV100)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'CodeStorage', keys.map(k => [k]))
    }

    async getAllAsV100(): Promise<(v100.PrefabWasmModule)[]> {
        assert(this.isV100)
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
    get isV100() {
        return this._chain.getStorageItemTypeHash('Contracts', 'ContractInfoOf') === 'b19f56551b6001070487b6e33ba3a88bf2e7a48df38a8c979b2d69856127de63'
    }

    /**
     *  The code associated with a given account.
     * 
     *  TWOX-NOTE: SAFE since `AccountId` is a secure hash.
     */
    async getAsV100(key: Uint8Array): Promise<v100.ContractInfo | undefined> {
        assert(this.isV100)
        return this._chain.getStorage(this.blockHash, 'Contracts', 'ContractInfoOf', key)
    }

    async getManyAsV100(keys: Uint8Array[]): Promise<(v100.ContractInfo | undefined)[]> {
        assert(this.isV100)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'ContractInfoOf', keys.map(k => [k]))
    }

    async getAllAsV100(): Promise<(v100.ContractInfo)[]> {
        assert(this.isV100)
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
    get isV100() {
        return this._chain.getStorageItemTypeHash('Contracts', 'OwnerInfoOf') === '76689686c73821ee740f33d092a38a05de83a2833f6c8857baa886203c5bf939'
    }

    /**
     *  A mapping between an original code hash and its owner information.
     */
    async getAsV100(key: Uint8Array): Promise<v100.OwnerInfo | undefined> {
        assert(this.isV100)
        return this._chain.getStorage(this.blockHash, 'Contracts', 'OwnerInfoOf', key)
    }

    async getManyAsV100(keys: Uint8Array[]): Promise<(v100.OwnerInfo | undefined)[]> {
        assert(this.isV100)
        return this._chain.queryStorage(this.blockHash, 'Contracts', 'OwnerInfoOf', keys.map(k => [k]))
    }

    async getAllAsV100(): Promise<(v100.OwnerInfo)[]> {
        assert(this.isV100)
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
    get isV100() {
        return this._chain.getStorageItemTypeHash('System', 'Account') === '1ddc7ade926221442c388ee4405a71c9428e548fab037445aaf4b3a78f4735c1'
    }

    /**
     *  The full account information for a particular account ID.
     */
    async getAsV100(key: Uint8Array): Promise<v100.AccountInfo> {
        assert(this.isV100)
        return this._chain.getStorage(this.blockHash, 'System', 'Account', key)
    }

    async getManyAsV100(keys: Uint8Array[]): Promise<(v100.AccountInfo)[]> {
        assert(this.isV100)
        return this._chain.queryStorage(this.blockHash, 'System', 'Account', keys.map(k => [k]))
    }

    async getAllAsV100(): Promise<(v100.AccountInfo)[]> {
        assert(this.isV100)
        return this._chain.queryStorage(this.blockHash, 'System', 'Account')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('System', 'Account') != null
    }
}
