import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import {Token} from "./token.model"

@Entity_()
export class ChainProperties {
  constructor(props?: Partial<ChainProperties>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  name!: string

  @Index_()
  @ManyToOne_(() => Token, {nullable: false})
  token!: Token

  @Column_("int4", {nullable: false})
  ss58Format!: number
}
