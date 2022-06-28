import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Extrinsic} from "./extrinsic.model"

@Entity_()
export class ContractCall {
  constructor(props?: Partial<ContractCall>) {
    Object.assign(this, props)
  }

  /**
   * Extrinsic ID
   */
  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  contractAddress!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  value!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  gasLimit!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  storageDepositLimit!: bigint | undefined | null

  @Column_("bytea", {nullable: true})
  data!: Uint8Array | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: false})
  extrinsic!: Extrinsic
}
