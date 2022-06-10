import assert from 'assert'
import {CallContext, Result, deprecateLatest} from './support'
import * as v100 from './v100'

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
  get isV100(): boolean {
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
  get asV100(): {dest: v100.MultiAddress, value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), data: Uint8Array} {
    assert(this.isV100)
    return this.ctx._chain.decodeCall(this.ctx.extrinsic)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {dest: v100.MultiAddress, value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), data: Uint8Array} {
    deprecateLatest()
    return this.asV100
  }
}

export class ContractsInstantiateCall {
  constructor(private ctx: CallContext) {
    assert(this.ctx.extrinsic.name === 'contracts.instantiate')
  }

  /**
   * Instantiates a contract from a previously deployed wasm binary.
   * 
   * This function is identical to [`Self::instantiate_with_code`] but without the
   * code deployment step. Instead, the `code_hash` of an on-chain deployed wasm binary
   * must be supplied.
   */
  get isV100(): boolean {
    return this.ctx._chain.getCallHash('contracts.instantiate') === '065e28d4aca8ef55389ab2cdeb357c40056320f063a3db0a6c9157a597c14b5b'
  }

  /**
   * Instantiates a contract from a previously deployed wasm binary.
   * 
   * This function is identical to [`Self::instantiate_with_code`] but without the
   * code deployment step. Instead, the `code_hash` of an on-chain deployed wasm binary
   * must be supplied.
   */
  get asV100(): {value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), codeHash: v100.H256, data: Uint8Array, salt: Uint8Array} {
    assert(this.isV100)
    return this.ctx._chain.decodeCall(this.ctx.extrinsic)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), codeHash: v100.H256, data: Uint8Array, salt: Uint8Array} {
    deprecateLatest()
    return this.asV100
  }
}

export class ContractsInstantiateWithCodeCall {
  constructor(private ctx: CallContext) {
    assert(this.ctx.extrinsic.name === 'contracts.instantiateWithCode' || this.ctx.extrinsic.name === 'contracts.instantiate_with_code')
  }

  /**
   * Instantiates a new contract from the supplied `code` optionally transferring
   * some balance.
   * 
   * This dispatchable has the same effect as calling [`Self::upload_code`] +
   * [`Self::instantiate`]. Bundling them together provides efficiency gains. Please
   * also check the documentation of [`Self::upload_code`].
   * 
   * # Parameters
   * 
   * * `value`: The balance to transfer from the `origin` to the newly created contract.
   * * `gas_limit`: The gas limit enforced when executing the constructor.
   * * `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved
   *   from the caller to pay for the storage consumed.
   * * `code`: The contract code to deploy in raw bytes.
   * * `data`: The input data to pass to the contract constructor.
   * * `salt`: Used for the address derivation. See [`Pallet::contract_address`].
   * 
   * Instantiation is executed as follows:
   * 
   * - The supplied `code` is instrumented, deployed, and a `code_hash` is created for that
   *   code.
   * - If the `code_hash` already exists on the chain the underlying `code` will be shared.
   * - The destination address is computed based on the sender, code_hash and the salt.
   * - The smart-contract account is created at the computed address.
   * - The `value` is transferred to the new account.
   * - The `deploy` function is executed in the context of the newly-created account.
   */
  get isV100(): boolean {
    return this.ctx._chain.getCallHash('contracts.instantiate_with_code') === '2204435764a14a39d7c13f6cffbf98550fcaad4cba9d91306fe99d88a718a62c'
  }

  /**
   * Instantiates a new contract from the supplied `code` optionally transferring
   * some balance.
   * 
   * This dispatchable has the same effect as calling [`Self::upload_code`] +
   * [`Self::instantiate`]. Bundling them together provides efficiency gains. Please
   * also check the documentation of [`Self::upload_code`].
   * 
   * # Parameters
   * 
   * * `value`: The balance to transfer from the `origin` to the newly created contract.
   * * `gas_limit`: The gas limit enforced when executing the constructor.
   * * `storage_deposit_limit`: The maximum amount of balance that can be charged/reserved
   *   from the caller to pay for the storage consumed.
   * * `code`: The contract code to deploy in raw bytes.
   * * `data`: The input data to pass to the contract constructor.
   * * `salt`: Used for the address derivation. See [`Pallet::contract_address`].
   * 
   * Instantiation is executed as follows:
   * 
   * - The supplied `code` is instrumented, deployed, and a `code_hash` is created for that
   *   code.
   * - If the `code_hash` already exists on the chain the underlying `code` will be shared.
   * - The destination address is computed based on the sender, code_hash and the salt.
   * - The smart-contract account is created at the computed address.
   * - The `value` is transferred to the new account.
   * - The `deploy` function is executed in the context of the newly-created account.
   */
  get asV100(): {value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), code: Uint8Array, data: Uint8Array, salt: Uint8Array} {
    assert(this.isV100)
    return this.ctx._chain.decodeCall(this.ctx.extrinsic)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {value: bigint, gasLimit: bigint, storageDepositLimit: (bigint | undefined), code: Uint8Array, data: Uint8Array, salt: Uint8Array} {
    deprecateLatest()
    return this.asV100
  }
}

export class ContractsRemoveCodeCall {
  constructor(private ctx: CallContext) {
    assert(this.ctx.extrinsic.name === 'contracts.removeCode' || this.ctx.extrinsic.name === 'contracts.remove_code')
  }

  /**
   * Remove the code stored under `code_hash` and refund the deposit to its owner.
   * 
   * A code can only be removed by its original uploader (its owner) and only if it is
   * not used by any contract.
   */
  get isV100(): boolean {
    return this.ctx._chain.getCallHash('contracts.remove_code') === '9e5c86c297bd88fae31bc40119e44695818ddc3ab8842b90daeb12771005c70d'
  }

  /**
   * Remove the code stored under `code_hash` and refund the deposit to its owner.
   * 
   * A code can only be removed by its original uploader (its owner) and only if it is
   * not used by any contract.
   */
  get asV100(): {codeHash: v100.H256} {
    assert(this.isV100)
    return this.ctx._chain.decodeCall(this.ctx.extrinsic)
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

export class ContractsUploadCodeCall {
  constructor(private ctx: CallContext) {
    assert(this.ctx.extrinsic.name === 'contracts.uploadCode' || this.ctx.extrinsic.name === 'contracts.upload_code')
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
  get isV100(): boolean {
    return this.ctx._chain.getCallHash('contracts.upload_code') === 'e5d80c6158333f4c26b9bf07184fcf08a6cc009b6fca8d942ba16f848c6a6417'
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
  get asV100(): {code: Uint8Array, storageDepositLimit: (bigint | undefined)} {
    assert(this.isV100)
    return this.ctx._chain.decodeCall(this.ctx.extrinsic)
  }

  get isLatest(): boolean {
    deprecateLatest()
    return this.isV100
  }

  get asLatest(): {code: Uint8Array, storageDepositLimit: (bigint | undefined)} {
    deprecateLatest()
    return this.asV100
  }
}
