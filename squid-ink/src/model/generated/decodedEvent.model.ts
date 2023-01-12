import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {DecodedArg} from "./_decodedArg"

@Entity_()
export class DecodedEvent {
  constructor(props?: Partial<DecodedEvent>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new DecodedArg(undefined, marshal.nonNull(val)))}, nullable: true})
  args!: (DecodedArg)[] | undefined | null
}
