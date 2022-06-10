import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Account} from "./account.model"
import {Contract} from "./contract.model"
import {Extrinsic} from "./extrinsic.model"

@Entity_()
export class ContractCode {
  constructor(props?: Partial<ContractCode>) {
    Object.assign(this, props)
  }

  /**
   * Code Hash
   */
  @PrimaryColumn_()
  id!: string

  @Column_("bytea", {nullable: false})
  code!: Uint8Array

  @Index_()
  @ManyToOne_(() => Account, {nullable: false})
  owner!: Account

  @Column_("timestamp with time zone", {nullable: true})
  uploadedOn!: Date | undefined | null

  @Column_("timestamp with time zone", {nullable: true})
  removedOn!: Date | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  storageDeposit!: bigint | undefined | null

  @OneToMany_(() => Contract, e => e.contractCode)
  contractsDeployed!: Contract[]

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: false})
  createdFrom!: Extrinsic
}
