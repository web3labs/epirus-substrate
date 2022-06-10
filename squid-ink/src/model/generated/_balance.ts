import assert from "assert"
import * as marshal from "./marshal"

export class Balance {
  private _free!: bigint
  private _reserved!: bigint
  private _miscFrozen!: bigint
  private _feeFrozen!: bigint

  constructor(props?: Partial<Omit<Balance, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._free = marshal.bigint.fromJSON(json.free)
      this._reserved = marshal.bigint.fromJSON(json.reserved)
      this._miscFrozen = marshal.bigint.fromJSON(json.miscFrozen)
      this._feeFrozen = marshal.bigint.fromJSON(json.feeFrozen)
    }
  }

  get free(): bigint {
    assert(this._free != null, 'uninitialized access')
    return this._free
  }

  set free(value: bigint) {
    this._free = value
  }

  get reserved(): bigint {
    assert(this._reserved != null, 'uninitialized access')
    return this._reserved
  }

  set reserved(value: bigint) {
    this._reserved = value
  }

  get miscFrozen(): bigint {
    assert(this._miscFrozen != null, 'uninitialized access')
    return this._miscFrozen
  }

  set miscFrozen(value: bigint) {
    this._miscFrozen = value
  }

  get feeFrozen(): bigint {
    assert(this._feeFrozen != null, 'uninitialized access')
    return this._feeFrozen
  }

  set feeFrozen(value: bigint) {
    this._feeFrozen = value
  }

  toJSON(): object {
    return {
      free: marshal.bigint.toJSON(this.free),
      reserved: marshal.bigint.toJSON(this.reserved),
      miscFrozen: marshal.bigint.toJSON(this.miscFrozen),
      feeFrozen: marshal.bigint.toJSON(this.feeFrozen),
    }
  }
}
