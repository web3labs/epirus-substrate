import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"
import {Args} from "./_args"

@Entity_()
export class Activity {
  constructor(props?: Partial<Activity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  type!: string

  @Column_("text", {nullable: false})
  action!: string

  @Column_("text", {nullable: true})
  to!: string | undefined | null

  @Column_("text", {nullable: true})
  from!: string | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new Args(undefined, marshal.nonNull(val)))}, nullable: true})
  args!: (Args)[] | undefined | null
}
