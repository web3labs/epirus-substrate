import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Token {
  constructor(props?: Partial<Token>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  tokenDecimals!: number

  @Column_("text", {nullable: false})
  tokenSymbol!: string
}
