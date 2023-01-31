import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, OneToOne as OneToOne_, JoinColumn as JoinColumn_, OneToMany as OneToMany_} from "typeorm"
import {ContractEvent} from "./contractEvent.model"
import {DecodedEventArg} from "./decodedEventArg.model"

@Entity_()
export class DecodedContractEvent {
  constructor(props?: Partial<DecodedContractEvent>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  name!: string

  @Index_({unique: true})
  @OneToOne_(() => ContractEvent, {nullable: false})
  @JoinColumn_()
  contractEvent!: ContractEvent

  @OneToMany_(() => DecodedEventArg, e => e.decodedEvent)
  args!: DecodedEventArg[]
}
