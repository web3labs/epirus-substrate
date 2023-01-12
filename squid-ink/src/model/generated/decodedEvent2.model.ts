import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class DecodedEvent2 {
  constructor(props?: Partial<DecodedEvent2>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("jsonb", {nullable: true})
  args!: unknown | undefined | null
}
