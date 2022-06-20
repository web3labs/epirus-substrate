import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import {
  ResolvedBalancesEndowedEvent,
  ResolvedBalancesTransferEvent,
  ResolvedBalancesWithdrawEvent,
} from "chains/normalised-return-types";
import { ss58Format } from "../../../chain-config";
import {
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
  resolve(): ResolvedBalancesTransferEvent {
    if (this.isV1) {
      const values = this.asV1;
      return {
        from: ss58.codec(ss58Format).encode(values[0]),
        to: ss58.codec(ss58Format).encode(values[1]),
        amount: values[2],
      };
    }
    if (this.isV27) {
      const { from, to, amount } = this.asV27;
      return {
        from: ss58.codec(ss58Format).encode(from),
        to: ss58.codec(ss58Format).encode(to),
        amount,
      };
    }
    throw new Error(
      "No runtime version found while decoding [BalancesTransferEvent]"
    );
  }
}

export class NormalisedBalancesEndowedEvent extends BalancesEndowedEvent {
  resolve(): ResolvedBalancesEndowedEvent {
    if (this.isV1) {
      const values = this.asV1;
      return {
        account: ss58.codec(ss58Format).encode(values[0]),
        freeBalance: values[1],
      };
    }
    if (this.isV27) {
      const { account, freeBalance } = this.asV27;
      return {
        account: ss58.codec(ss58Format).encode(account),
        freeBalance,
      };
    }
    throw new Error(
      "No runtime version found while decoding [BalancesEndowedEvent]"
    );
  }
}

export class NormalisedBalancesWithdrawEvent extends BalancesWithdrawEvent {
  resolve(): ResolvedBalancesWithdrawEvent {
    if (this.isV27) {
      const { who, amount } = this.asV27;
      return {
        account: ss58.codec(ss58Format).encode(who),
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
    if (this.isV1) {
      const values = this.asV1;
      return {
        account: ss58.codec(ss58Format).encode(values[0]),
        amount: values[1],
      };
    }
    if (this.isV27) {
      const { who, amount } = this.asV27;
      return {
        account: ss58.codec(ss58Format).encode(who),
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
    if (this.isV31) {
      const { deployer, contract } = this.asV31;
      return {
        deployer: ss58.codec(ss58Format).encode(deployer),
        contract: ss58.codec(ss58Format).encode(contract),
      };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsInstantiatedEvent]"
    );
  }
}

export class NormalisedContractsCodeStoredEvent extends ContractsCodeStoredEvent {
  resolve(): { codeHash: string } {
    if (this.isV31) {
      const { codeHash } = this.asV31;
      return { codeHash: toHex(codeHash) };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsCodeStoredEvent]"
    );
  }
}

export class NormalisedContractEmittedEvent extends ContractsContractEmittedEvent {
  resolve(): { contract: string; data: Uint8Array } {
    if (this.isV31) {
      const { contract, data } = this.asV31;
      return { contract: ss58.codec(ss58Format).encode(contract), data };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsContractEmittedEvent]"
    );
  }
}

export class NormalisedSystemNewAccountEvent extends SystemNewAccountEvent {
  resolve(): { account: string } {
    if (this.isV1) {
      return { account: ss58.codec(ss58Format).encode(this.asV1) };
    }
    if (this.isV31) {
      const { account } = this.asV31;
      return { account: ss58.codec(ss58Format).encode(account) };
    }
    throw new Error(
      "No runtime version found while decoding [SystemNewAccountEvent]"
    );
  }
}
