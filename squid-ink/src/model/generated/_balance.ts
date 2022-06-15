import assert from "assert"
import * as marshal from "./marshal"

export class Balance {
  private _free!: bigint | undefined | null
  private _reserved!: bigint | undefined | null
  private _miscFrozen!: bigint | undefined | null
  private _feeFrozen!: bigint | undefined | null

  constructor(props?: Partial<Omit<Balance, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._free = json.free == null ? undefined : marshal.bigint.fromJSON(json.free)
      this._reserved = json.reserved == null ? undefined : marshal.bigint.fromJSON(json.reserved)
      this._miscFrozen = json.miscFrozen == null ? undefined : marshal.bigint.fromJSON(json.miscFrozen)
      this._feeFrozen = json.feeFrozen == null ? undefined : marshal.bigint.fromJSON(json.feeFrozen)
    }
  }

  get free(): bigint | undefined | null {
    return this._free
  }

  set free(value: bigint | undefined | null) {
    this._free = value
  }

  get reserved(): bigint | undefined | null {
    return this._reserved
  }

  set reserved(value: bigint | undefined | null) {
    this._reserved = value
  }

  get miscFrozen(): bigint | undefined | null {
    return this._miscFrozen
  }

  set miscFrozen(value: bigint | undefined | null) {
    this._miscFrozen = value
  }

  get feeFrozen(): bigint | undefined | null {
    return this._feeFrozen
  }

  set feeFrozen(value: bigint | undefined | null) {
    this._feeFrozen = value
  }

  toJSON(): object {
    return {
      free: this.free == null ? undefined : marshal.bigint.toJSON(this.free),
      reserved: this.reserved == null ? undefined : marshal.bigint.toJSON(this.reserved),
      miscFrozen: this.miscFrozen == null ? undefined : marshal.bigint.toJSON(this.miscFrozen),
      feeFrozen: this.feeFrozen == null ? undefined : marshal.bigint.toJSON(this.feeFrozen),
    }
  }
}
