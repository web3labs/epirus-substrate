import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import {
  BalancesTransferEvent,
  ContractsCodeStoredEvent,
  ContractsInstantiatedEvent,
} from "../types/events";

export class NormalisedBalancesTransferEvent extends BalancesTransferEvent {
  resolve(): { from: string; to: string; amount: bigint } {
    if (this.isV100) {
      const { from, to, amount } = this.asV100;
      return {
        from: ss58.codec("substrate").encode(from),
        to: ss58.codec("substrate").encode(to),
        amount,
      };
    }
    throw new Error("No Runtime version found");
  }
}

export class NormalisedContractsInstantiatedEvent extends ContractsInstantiatedEvent {
  resolve(): { deployer: string; contract: string } {
    if (this.isV100) {
      const { deployer, contract } = this.asV100;
      return {
        deployer: ss58.codec("substrate").encode(deployer),
        contract: ss58.codec("substrate").encode(contract),
      };
    }
    throw new Error("No Runtime version found");
  }
}

export class NormalisedContractsCodeStoredEvent extends ContractsCodeStoredEvent {
  resolve(): { codeHash: string } {
    if (this.isV100) {
      const { codeHash } = this.asV100;
      return { codeHash: toHex(codeHash) };
    }
    throw new Error("No Runtime version found");
  }
}
