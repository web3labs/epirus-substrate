import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Args} from "./_args"
import {Events} from "./events.model"

@Entity_()
export class Extrinsic {
  constructor(props?: Partial<Extrinsic>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: false})
  method!: string

  @Column_("text", {nullable: false})
  section!: string

  @Column_("text", {nullable: false})
  blockHash!: string

  @Column_("text", {nullable: false})
  blockNumber!: string

  @Column_("text", {nullable: false})
  versionInfo!: string

  @Column_("text", {nullable: true})
  indexInBlock!: string | undefined | null

  @Column_("text", {nullable: true})
  hash!: string | undefined | null

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("text", {nullable: true})
  signature!: string | undefined | null

  @Column_("text", {nullable: false})
  signer!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  tip!: bigint | undefined | null

  @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => new Args(undefined, marshal.nonNull(val)))}, nullable: true})
  args!: (Args)[] | undefined | null

  @OneToMany_(() => Events, e => e.extrinsic)
  events!: Events[]
}
