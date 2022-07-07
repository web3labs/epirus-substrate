import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result} from './support'
import * as v16 from './v16'

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
  get isV16(): boolean {
    return this._chain.getCallHash('Contracts.call') === 'd96c8a6656d7a4d6af6d5d0d51dd36e041c9ea8a92a7ead343d711addd74780f'
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
  get asV16(): {dest: v16.MultiAddress, value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), data: Uint8Array} {
    assert(this.isV16)
    return this._chain.decodeCall(this.call)
  }
}

export class ContractsUploadCodeCall {
  private readonly _chain: Chain
  private readonly call: Call

  constructor(ctx: CallContext)
  constructor(ctx: ChainContext, call: Call)
  constructor(ctx: CallContext, call?: Call) {
    call = call || ctx.call
    assert(call.name === 'Contracts.upload_code')
    this._chain = ctx._chain
    this.call = call
  }

  /**
   * Upload new `code` without instantiating a contract from it.
   * 
   * If the code does not already exist a deposit is reserved from the caller
   * and unreserved only when [`Self::remove_code`] is called. The size of the reserve
   * depends on the instrumented size of the the supplied `code`.
   * 
   * If the code already exists in storage it will still return `Ok` and upgrades
   * the in storage version to the current
   * [`InstructionWeights::version`](InstructionWeights).
   * 
   * # Note
   * 
   * Anyone can instantiate a contract from any uploaded code and thus prevent its removal.
   * To avoid this situation a constructor could employ access control so that it can
   * only be instantiated by permissioned entities. The same is true when uploading
   * through [`Self::instantiate_with_code`].
   */
  get isV16(): boolean {
    return this._chain.getCallHash('Contracts.upload_code') === 'e5d80c6158333f4c26b9bf07184fcf08a6cc009b6fca8d942ba16f848c6a6417'
  }

  /**
   * Upload new `code` without instantiating a contract from it.
   * 
   * If the code does not already exist a deposit is reserved from the caller
   * and unreserved only when [`Self::remove_code`] is called. The size of the reserve
   * depends on the instrumented size of the the supplied `code`.
   * 
   * If the code already exists in storage it will still return `Ok` and upgrades
   * the in storage version to the current
   * [`InstructionWeights::version`](InstructionWeights).
   * 
   * # Note
   * 
   * Anyone can instantiate a contract from any uploaded code and thus prevent its removal.
   * To avoid this situation a constructor could employ access control so that it can
   * only be instantiated by permissioned entities. The same is true when uploading
   * through [`Self::instantiate_with_code`].
   */
  get asV16(): {code: Uint8Array, storageDepositLimit: (bigint | undefined)} {
    assert(this.isV16)
    return this._chain.decodeCall(this.call)
  }
}
