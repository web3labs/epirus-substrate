import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {DecodedContractAction} from "./decodedContractAction.model"

@Entity_()
export class DecodedArg {
  constructor(props?: Partial<DecodedArg>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => DecodedContractAction, {nullable: false})
  decodedEvent!: DecodedContractAction

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  value!: string

  @Column_("text", {nullable: false})
  type!: string

  @Column_("text", {nullable: true})
  displayName!: string | undefined | null
}
