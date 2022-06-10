import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Extrinsic} from "./extrinsic.model"
import {Args} from "./_args"

@Entity_()
export class Events {
  constructor(props?: Partial<Events>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @ManyToOne_(() => Extrinsic, {nullable: false})
  extrinsic!: Extrinsic

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  method!: string

  @Column_("text", {nullable: false})
  blockNumber!: string

  @Column_("text", {nullable: false})
  indexInBlock!: string

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new Args(undefined, marshal.nonNull(val)))}, nullable: true})
  params!: (Args)[] | undefined | null
}
