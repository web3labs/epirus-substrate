import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Contract} from "./contract.model"
import {Extrinsic} from "./extrinsic.model"

@Entity_()
export class CodeHashChange {
  constructor(props?: Partial<CodeHashChange>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Contract, {nullable: false})
  contract!: Contract

  @Column_("text", {nullable: false})
  newCodeHash!: string

  @Column_("text", {nullable: false})
  oldCodeHash!: string

  @Column_("timestamp with time zone", {nullable: false})
  changedAt!: Date

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: false})
  extrinsic!: Extrinsic
}
