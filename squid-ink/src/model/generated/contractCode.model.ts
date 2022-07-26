import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Account} from "./account.model"
import {Extrinsic} from "./extrinsic.model"
import {Contract} from "./contract.model"

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

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: false})
  createdFrom!: Extrinsic

  @Column_("timestamp with time zone", {nullable: true})
  removedAt!: Date | undefined | null

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: true})
  removedFrom!: Extrinsic | undefined | null

  @OneToMany_(() => Contract, e => e.contractCode)
  contractsDeployed!: Contract[]
}
