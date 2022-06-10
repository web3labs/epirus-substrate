import assert from "assert"
import * as marshal from "./marshal"

export class Args {
  private _type!: string
  private _name!: string
  private _value!: string | undefined | null

  constructor(props?: Partial<Omit<Args, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._type = marshal.string.fromJSON(json.type)
      this._name = marshal.string.fromJSON(json.name)
      this._value = json.value == null ? undefined : marshal.string.fromJSON(json.value)
    }
  }

  get type(): string {
    assert(this._type != null, 'uninitialized access')
    return this._type
  }

  set type(value: string) {
    this._type = value
  }

  get name(): string {
    assert(this._name != null, 'uninitialized access')
    return this._name
  }

  set name(value: string) {
    this._name = value
  }

  get value(): string | undefined | null {
    return this._value
  }

  set value(value: string | undefined | null) {
    this._value = value
  }

  toJSON(): object {
    return {
      type: this.type,
      name: this.name,
      value: this.value,
    }
  }
}
