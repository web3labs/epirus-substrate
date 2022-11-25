import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'
import * as canvasKusamaV16 from './canvasKusamaV16'
import * as v9290 from './v9290'
import * as v9321 from './v9321'

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
  get isCanvasKusamaV16(): boolean {
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
  get asCanvasKusamaV16(): {dest: canvasKusamaV16.MultiAddress, value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), data: Uint8Array} {
    assert(this.isCanvasKusamaV16)
    return this._chain.decodeCall(this.call)
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
  get isV9290(): boolean {
    return this._chain.getCallHash('Contracts.call') === '02511922863054b5c354386a9605ca660c51d4316bc5c8d224b533cb6036f669'
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
  get asV9290(): {dest: v9290.MultiAddress, value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), data: Uint8Array} {
    assert(this.isV9290)
    return this._chain.decodeCall(this.call)
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
  get isV9321(): boolean {
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
  get asV9321(): {dest: v9321.MultiAddress, value: bigint, gasLimit: v9321.Weight, storageDepositLimit: (bigint | undefined), data: Uint8Array} {
    assert(this.isV9321)
    return this._chain.decodeCall(this.call)
  }
}
