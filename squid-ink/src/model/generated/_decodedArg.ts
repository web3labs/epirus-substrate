import assert from "assert"
import * as marshal from "./marshal"
import {Account} from "./account.model"

export class DecodedArg {
  private _name!: string
  private _value!: string
  private _account!: string | undefined | null
  private _bigInt!: bigint | undefined | null
  private _type!: string

  constructor(props?: Partial<Omit<DecodedArg, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._name = marshal.string.fromJSON(json.name)
      this._value = marshal.string.fromJSON(json.value)
      this._account = json.account == null ? undefined : marshal.string.fromJSON(json.account)
      this._bigInt = json.bigInt == null ? undefined : marshal.bigint.fromJSON(json.bigInt)
      this._type = marshal.string.fromJSON(json.type)
    }
  }

  get name(): string {
    assert(this._name != null, 'uninitialized access')
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get value(): string {
    assert(this._value != null, 'uninitialized access')
    return this._value
  }

  set value(value: string) {
    this._value = value
  }

  get account(): string | undefined | null {
    return this._account
  }

  set account(value: string | undefined | null) {
    this._account = value
  }

  get bigInt(): bigint | undefined | null {
    return this._bigInt
  }

  set bigInt(value: bigint | undefined | null) {
    this._bigInt = value
  }

  get type(): string {
    assert(this._type != null, 'uninitialized access')
    return this._type
  }

  set type(value: string) {
    this._type = value
  }

  toJSON(): object {
    return {
      name: this.name,
      value: this.value,
      account: this.account,
      bigInt: this.bigInt == null ? undefined : marshal.bigint.toJSON(this.bigInt),
      type: this.type,
    }
  }
}
