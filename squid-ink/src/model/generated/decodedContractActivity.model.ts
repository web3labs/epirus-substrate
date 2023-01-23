import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {Activity} from "./activity.model"
import {DecodedActivityArg} from "./decodedActivityArg.model"

@Entity_()
export class DecodedContractActivity {
  constructor(props?: Partial<DecodedContractActivity>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  name!: string

  @Index_()
  @ManyToOne_(() => Activity, {nullable: false})
  activity!: Activity

  @OneToMany_(() => DecodedActivityArg, e => e.decodedActivity)
  args!: DecodedActivityArg[]
}
