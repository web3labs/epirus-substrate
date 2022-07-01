import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToOne as OneToOne_, Index as Index_, JoinColumn as JoinColumn_, ManyToOne as ManyToOne_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {ContractCode} from "./contractCode.model"
import {Extrinsic} from "./extrinsic.model"
import {CodeHashChange} from "./codeHashChange.model"

@Entity_()
export class Contract {
  constructor(props?: Partial<Contract>) {
    Object.assign(this, props)
  }

  /**
   * Contract address
   */
  @PrimaryColumn_()
  id!: string

  @Column_("bytea", {nullable: false})
  trieId!: Uint8Array

  @Index_({unique: true})
  @OneToOne_(() => Account, {nullable: false})
  @JoinColumn_()
  account!: Account

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  deployer!: Account

  @Index_()
  @ManyToOne_(() => ContractCode, {nullable: false})
  contractCode!: ContractCode

  @Index_()
  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("text", {nullable: true})
  salt!: string | undefined | null

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: false})
  createdFrom!: Extrinsic

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
  storageDeposit!: bigint

  @OneToMany_(() => CodeHashChange, e => e.contract)
  codeHashChanges!: CodeHashChange[]
}
