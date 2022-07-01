import assert from 'assert'
import {CallContext, Result, deprecateLatest} from './support'
import * as v16 from './v16'
import * as v9220 from './v9220'

export class ContractsCallCall {
  constructor(private ctx: CallContext) {
    assert(this.ctx.extrinsic.name === 'contracts.call')
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
    return this.ctx._chain.getCallHash('contracts.call') === 'd96c8a6656d7a4d6af6d5d0d51dd36e041c9ea8a92a7ead343d711addd74780f'
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
    return this.ctx._chain.decodeCall(this.ctx.extrinsic)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV16
  }

  get asLatest(): {dest: v16.MultiAddress, value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), data: Uint8Array} {
    deprecateLatest()
    return this.asV16
  }
}

export class ContractsSetCodeCall {
  constructor(private ctx: CallContext) {
    assert(this.ctx.extrinsic.name === 'contracts.setCode' || this.ctx.extrinsic.name === 'contracts.set_code')
  }

  /**
   * Privileged function that changes the code of an existing contract.
   * 
   * This takes care of updating refcounts and all other necessary operations. Returns
   * an error if either the `code_hash` or `dest` do not exist.
   * 
   * # Note
   * 
   * This does **not** change the address of the contract in question. This means
   * that the contract address is no longer derived from its code hash after calling
   * this dispatchable.
   */
  get isV9220(): boolean {
    return this.ctx._chain.getCallHash('contracts.set_code') === '70cd8e4f03fe2c8334a13735563897eedfa16eb9b8e0c97b3aacce6c108aacc0'
  }

  /**
   * Privileged function that changes the code of an existing contract.
   * 
   * This takes care of updating refcounts and all other necessary operations. Returns
   * an error if either the `code_hash` or `dest` do not exist.
   * 
   * # Note
   * 
   * This does **not** change the address of the contract in question. This means
   * that the contract address is no longer derived from its code hash after calling
   * this dispatchable.
   */
  get asV9220(): {dest: v9220.MultiAddress, codeHash: v9220.H256} {
    assert(this.isV9220)
    return this.ctx._chain.decodeCall(this.ctx.extrinsic)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV9220
  }

  get asLatest(): {dest: v9220.MultiAddress, codeHash: v9220.H256} {
    deprecateLatest()
    return this.asV9220
  }
}
