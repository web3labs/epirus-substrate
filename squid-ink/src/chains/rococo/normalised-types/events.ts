import * as ss58 from "@subsquid/ss58";
import { toHex } from "@subsquid/util-internal-hex";
import {
  ResolvedBalancesEndowedEvent,
  ResolvedBalancesReservedEvent,
  ResolvedBalancesTransferEvent,
  ResolvedBalancesWithdrawEvent,
  ResolvedContractEmittedEvent,
  ResolvedContractsCodeStoredEvent,
  ResolvedContractsInstantiatedEvent,
  ResolvedNewAccountEvent,
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
    if (this.isV16) {
      const { from, to, amount } = this.asV16;
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
    if (this.isV16) {
      const { account, freeBalance } = this.asV16;
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
    if (this.isV16) {
      const { who, amount } = this.asV16;
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
  resolve(): ResolvedBalancesReservedEvent {
    if (this.isV16) {
      const { who, amount } = this.asV16;
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
  resolve(): ResolvedContractsInstantiatedEvent {
    if (this.isV16) {
      const { deployer, contract } = this.asV16;
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
  resolve(): ResolvedContractsCodeStoredEvent {
    if (this.isV16) {
      const { codeHash } = this.asV16;
      return { codeHash: toHex(codeHash) };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsCodeStoredEvent]"
    );
  }
}

export class NormalisedContractEmittedEvent extends ContractsContractEmittedEvent {
  resolve(): ResolvedContractEmittedEvent {
    if (this.isV16) {
      const { contract, data } = this.asV16;
      return { contract: ss58.codec(ss58Format).encode(contract), data };
    }
    throw new Error(
      "No runtime version found while decoding [ContractsContractEmittedEvent]"
    );
  }
}

export class NormalisedSystemNewAccountEvent extends SystemNewAccountEvent {
  resolve(): ResolvedNewAccountEvent {
    if (this.isV16) {
      const { account } = this.asV16;
      return { account: ss58.codec(ss58Format).encode(account) };
    }
    throw new Error(
      "No runtime version found while decoding [SystemNewAccountEvent]"
    );
  }
}
