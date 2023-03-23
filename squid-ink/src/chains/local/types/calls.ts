import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'
import * as v100 from './v100'

export class ContractsCallCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Contracts.call')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Makes a call to an account, optionally transferring some balance.
     * 
     * # Parameters
     * 
     * * `dest`: Address of the contract to call.
     * * `value`: The balance to transfer from the `origin` to `dest`.
     * * `gas_limit`: The gas limit enforced when executing the constructor.
     * * `storage_deposit_limit`: The maximum amount of balance that can be charged from the
     *   caller to pay for the storage consumed.
     * * `data`: The input data to pass to the contract.
     * 
     * * If the account is a smart-contract account, the associated code will be
     * executed and any value will be transferred.
     * * If the account is a regular account, any value will be transferred.
     * * If no account exists and the call value is not less than `existential_deposit`,
     * a regular account will be created and any value will be transferred.
     */
    get isV100(): boolean {
        return this._chain.getCallHash('Contracts.call') === '9b1b707b0f5c537afca26d44d0081d29092614e330ff3810d328d0342d6a1845'
    }

    /**
     * Makes a call to an account, optionally transferring some balance.
     * 
     * # Parameters
     * 
     * * `dest`: Address of the contract to call.
     * * `value`: The balance to transfer from the `origin` to `dest`.
     * * `gas_limit`: The gas limit enforced when executing the constructor.
     * * `storage_deposit_limit`: The maximum amount of balance that can be charged from the
     *   caller to pay for the storage consumed.
     * * `data`: The input data to pass to the contract.
     * 
     * * If the account is a smart-contract account, the associated code will be
     * executed and any value will be transferred.
     * * If the account is a regular account, any value will be transferred.
     * * If no account exists and the call value is not less than `existential_deposit`,
     * a regular account will be created and any value will be transferred.
     */
    get asV100(): {dest: v100.MultiAddress, value: bigint, gasLimit: v100.Weight, storageDepositLimit: (bigint | undefined), data: Uint8Array} {
        assert(this.isV100)
        return this._chain.decodeCall(this.call)
    }
}
