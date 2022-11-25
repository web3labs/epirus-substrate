import assert from "assert"
import * as marshal from "./marshal"

export class StorageInfo {
  private _storageBytes!: number | undefined | null
  private _storageItems!: number | undefined | null
  private _storageByteDeposit!: bigint | undefined | null
  private _storageItemDeposit!: bigint | undefined | null
  private _storageBaseDeposit!: bigint | undefined | null

  constructor(props?: Partial<Omit<StorageInfo, 'toJSON'>>, json?: any) {
    Object.assign(this, props)
    if (json != null) {
      this._storageBytes = json.storageBytes == null ? undefined : marshal.int.fromJSON(json.storageBytes)
      this._storageItems = json.storageItems == null ? undefined : marshal.int.fromJSON(json.storageItems)
      this._storageByteDeposit = json.storageByteDeposit == null ? undefined : marshal.bigint.fromJSON(json.storageByteDeposit)
      this._storageItemDeposit = json.storageItemDeposit == null ? undefined : marshal.bigint.fromJSON(json.storageItemDeposit)
      this._storageBaseDeposit = json.storageBaseDeposit == null ? undefined : marshal.bigint.fromJSON(json.storageBaseDeposit)
    }
  }

  get storageBytes(): number | undefined | null {
    return this._storageBytes
  }

  set storageBytes(value: number | undefined | null) {
    this._storageBytes = value
  }

  get storageItems(): number | undefined | null {
    return this._storageItems
  }

  set storageItems(value: number | undefined | null) {
    this._storageItems = value
  }

  get storageByteDeposit(): bigint | undefined | null {
    return this._storageByteDeposit
  }

  set storageByteDeposit(value: bigint | undefined | null) {
    this._storageByteDeposit = value
  }

  get storageItemDeposit(): bigint | undefined | null {
    return this._storageItemDeposit
  }

  set storageItemDeposit(value: bigint | undefined | null) {
    this._storageItemDeposit = value
  }

  get storageBaseDeposit(): bigint | undefined | null {
    return this._storageBaseDeposit
  }

  set storageBaseDeposit(value: bigint | undefined | null) {
    this._storageBaseDeposit = value
  }

  toJSON(): object {
    return {
      storageBytes: this.storageBytes,
      storageItems: this.storageItems,
      storageByteDeposit: this.storageByteDeposit == null ? undefined : marshal.bigint.toJSON(this.storageByteDeposit),
      storageItemDeposit: this.storageItemDeposit == null ? undefined : marshal.bigint.toJSON(this.storageItemDeposit),
      storageBaseDeposit: this.storageBaseDeposit == null ? undefined : marshal.bigint.toJSON(this.storageBaseDeposit),
    }
  }
}
