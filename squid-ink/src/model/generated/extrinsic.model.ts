import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import * as marshal from "./marshal"
import {Events} from "./events.model"

@Entity_()
export class Extrinsic {
  constructor(props?: Partial<Extrinsic>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("int4", {nullable: false})
  blockNumber!: number

  @Column_("int4", {nullable: false})
  indexInBlock!: number

  @Column_("int4", {nullable: false})
  versionInfo!: number

  @Column_("text", {nullable: false})
  name!: string

  @Column_("text", {nullable: true})
  signer!: string | undefined | null

  @Column_("text", {nullable: true})
  signature!: string | undefined | null

  @Column_("bool", {nullable: false})
  success!: boolean

  @Column_("jsonb", {nullable: true})
  error!: unknown | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  fee!: bigint | undefined | null

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
  tip!: bigint | undefined | null

  @Column_("text", {nullable: false})
  hash!: string

  @Column_("timestamp with time zone", {nullable: false})
  createdAt!: Date

  @Column_("jsonb", {nullable: true})
  args!: unknown | undefined | null

  @OneToMany_(() => Events, e => e.extrinsic)
  events!: Events[]
}
