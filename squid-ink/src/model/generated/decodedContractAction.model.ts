import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {ContractActionType} from "./_contractActionType"
import {DecodedArg} from "./decodedArg.model"

@Entity_()
export class DecodedContractAction {
  constructor(props?: Partial<DecodedContractAction>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  name!: string

  @Column_("varchar", {length: 11, nullable: false})
  type!: ContractActionType

  @OneToMany_(() => DecodedArg, e => e.decodedEvent)
  args!: DecodedArg[]
}
