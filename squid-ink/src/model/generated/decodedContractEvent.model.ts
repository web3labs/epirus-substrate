import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, OneToMany as OneToMany_} from "typeorm"
import {ContractEvent} from "./contractEvent.model"
import {DecodedEventArg} from "./decodedEventArg.model"

@Entity_()
export class DecodedContractEvent {
  constructor(props?: Partial<DecodedContractEvent>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  name!: string

  @Index_()
  @ManyToOne_(() => ContractEvent, {nullable: false})
  contractEvent!: ContractEvent

  @OneToMany_(() => DecodedEventArg, e => e.decodedEvent)
  args!: DecodedEventArg[]
}
