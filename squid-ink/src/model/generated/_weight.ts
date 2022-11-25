import assert from "assert"
import * as marshal from "./marshal"

export class Weight {
  private _refTime!: bigint | undefined | null
  private _proofSize!: bigint | undefined | null

  constructor(props?: Partial<Omit<Weight, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._refTime = json.refTime == null ? undefined : marshal.bigint.fromJSON(json.refTime)
      this._proofSize = json.proofSize == null ? undefined : marshal.bigint.fromJSON(json.proofSize)
    }
  }

  get refTime(): bigint | undefined | null {
    return this._refTime
  }

  set refTime(value: bigint | undefined | null) {
    this._refTime = value
  }

  get proofSize(): bigint | undefined | null {
    return this._proofSize
  }

  set proofSize(value: bigint | undefined | null) {
    this._proofSize = value
  }

  toJSON(): object {
    return {
      refTime: this.refTime == null ? undefined : marshal.bigint.toJSON(this.refTime),
      proofSize: this.proofSize == null ? undefined : marshal.bigint.toJSON(this.proofSize),
    }
  }
}
