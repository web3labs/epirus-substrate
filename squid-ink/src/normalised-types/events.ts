import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import {
  BalancesDepositEvent,
  BalancesEndowedEvent,
  BalancesReservedEvent,
  BalancesTransferEvent,
  BalancesWithdrawEvent,
  ContractsCodeStoredEvent,
  ContractsContractEmittedEvent,
  ContractsInstantiatedEvent,
  SystemNewAccountEvent,
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
    throw new Error(
      "No runtime version found while decoding [BalancesTransferEvent]"
    );
  }
}

export class NormalisedBalancesEndowedEvent extends BalancesEndowedEvent {
  resolve(): { account: string; freeBalance: bigint } {
    if (this.isV100) {
      const { account, freeBalance } = this.asV100;
      return {
        account: ss58.codec("substrate").encode(account),
        freeBalance,
      };
    }
    throw new Error(
      "No runtime version found while decoding [BalancesEndowedEvent]"
    );
  }
}

export class NormalisedBalancesWithdrawEvent extends BalancesWithdrawEvent {
  resolve(): { account: string; amount: bigint } {
    if (this.isV100) {
      const { who, amount } = this.asV100;
      return {
        account: ss58.codec("substrate").encode(who),
        amount,
      };
    }
    throw new Error(
      "No runtime version found while decoding [BalancesWithdrawEvent]"
    );
  }
}

export class NormalisedBalancesReservedEvent extends BalancesReservedEvent {
  resolve(): { account: string; amount: bigint } {
    if (this.isV100) {
      const { who, amount } = this.asV100;
      return {
        account: ss58.codec("substrate").encode(who),
        amount,
      };
    }
    throw new Error(
      "No runtime version found while decoding [BalancesReservedEvent]"
    );
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
    throw new Error(
      "No runtime version found while decoding [ContractsInstantiatedEvent]"
    );
  }
}

export class NormalisedContractsCodeStoredEvent extends ContractsCodeStoredEvent {
  resolve(): { codeHash: string } {
    if (this.isV100) {
      const { codeHash } = this.asV100;
      return { codeHash: toHex(codeHash) };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsCodeStoredEvent]"
    );
  }
}

export class NormalisedContractEmittedEvent extends ContractsContractEmittedEvent {
  resolve(): { contract: string; data: Uint8Array } {
    if (this.isV100) {
      const { contract, data } = this.asV100;
      return { contract: toHex(contract), data };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsContractEmittedEvent]"
    );
  }
}

export class NormalisedSystemNewAccountEvent extends SystemNewAccountEvent {
  resolve(): { account: string } {
    if (this.isV100) {
      const { account } = this.asV100;
      return { account: ss58.codec("substrate").encode(account) };
    }
    throw new Error(
      "No runtime version found while decoding [SystemNewAccountEvent]"
    );
  }
}
