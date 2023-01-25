import { decodeHex } from "@subsquid/util-internal-hex";
import { Activity, ActivityType, ContractEvent } from "../model";

export function getMockContractEventEntity(): ContractEvent {
  return new ContractEvent({
    id: "0000000001-000008-54600",
    data: decodeHex(
      "0x00000190b5ab205c6974c9ea841be688864633dc9ca8a357843eeacf2314649965fe220080fbcf19b6cf2f3000000000000000"
    ),
    indexInBlock: "10",
    createdAt: new Date("2023-01-25T11:30:55.924000Z"),
    contractAddress: "5C5oBwXQCbBiuSBmRK6YFDJFMCgdHc8RbBBNmJvLysxVfYNN",
    blockNumber: "1",
  });
}

export function getMockActivityEntity(): Activity {
  return new Activity({
    id: "0000000001-000001-54600-CONTRACT",
    type: ActivityType.CONTRACT,
    action: "Contracts.instantiate_with_code",
    createdAt: new Date("2023-01-25T11:30:55.924000Z"),
  });
}
