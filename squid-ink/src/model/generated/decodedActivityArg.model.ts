import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {DecodedContractActivity} from "./decodedContractActivity.model"

@Entity_()
export class DecodedActivityArg {
  constructor(props?: Partial<DecodedActivityArg>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => DecodedContractActivity, {nullable: false})
  decodedActivity!: DecodedContractActivity

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  value!: string

  @Column_("text", {nullable: false})
  type!: string

  @Column_("text", {nullable: true})
  displayName!: string | undefined | null
}
